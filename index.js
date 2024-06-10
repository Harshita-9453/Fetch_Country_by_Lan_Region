

// Create form elements
const form = document.getElementById('form');

// Dropdown for search query
const searchQueryLabel = document.createElement('label');
searchQueryLabel.textContent = 'Please choose search query:';
const searchQueryDropdown = document.createElement('select');
searchQueryDropdown.disabled = true;
// Populate dropdown based on selected search type
// Function to populate dropdown options
function populateDropdown(options) {
    searchQueryDropdown.innerHTML = ''; // Clear previous options
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        searchQueryDropdown.appendChild(optionElement);
    });
}
let filtervalue;
// Event listener for search type change
form.addEventListener('change', (event) => {
    if (event.target.name === 'searchType') {
        const selectedType = event.target.value;
        filtervalue=selectedType;
        if (selectedType === 'byRegion') {
            // Populate dropdown with regions
            populateDropdown(externalService.getRegionsList());
        } else if (selectedType === 'byLanguage') {
            // Populate dropdown with languages
            populateDropdown(externalService.getLanguagesList());
        }
        searchQueryDropdown.disabled = false;
    }
});
// Add event listener to the select element
let selectedValue ;
const tableBody = document.createElement('tbody');
searchQueryDropdown.addEventListener('change', function() {
    // Get the selected value
    let selectedValue = searchQueryDropdown.value;
    let tbldata;
    // Now you can use the selectedValue as needed
    console.log('Selected value:', selectedValue);
    // Create table body
    if (filtervalue === 'byRegion') {
        // Populate dropdown with regions
        tbldata=externalService.getCountryListByRegion(selectedValue);
    } else if (filtervalue === 'byLanguage') {
        // Populate dropdown with languages
        tbldata=externalService.getCountryListByLanguage(selectedValue);
    }

console.log(tbldata);
tableBody.innerHTML = '';
tbldata.forEach(country => {
    const { name, capital, region, languages, area, flagURL } = country;

    // Extract language names from the languages object
    const languagesList = Object.values(languages).join(', ');

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>${capital || '-'}</td>
      <td>${region || '-'}</td>
      <td>${languagesList || '-'}</td>
      <td>${area || '-'}</td>
      <td><img src="${flagURL}" alt="${name} Flag" style="width: 30px; height: auto;"></td>
    `;

    tableBody.appendChild(row);
});


// Append table body to table
table.appendChild(tableBody);
});

//form.appendChild(searchQueryLabel);
form.appendChild(searchQueryDropdown);

// Create table for search results
const table = document.createElement('table');
// Create table headers
const tableHeaders = ['Country name', 'Capital', 'World region', 'Languages', 'Area', 'Flag'];
const tableHeaderRow = document.createElement('tr');
tableHeaders.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    // Add event listener for sorting
    // Sorting logic will go here
    //tableHeaderRow.appendChild(th);
});
table.appendChild(tableHeaderRow);



// Function to sort table rows based on column index and sort direction
function sortTable(columnIndex, ascending) {
    const rows = Array.from(tableBody.querySelectorAll('tr'));
    rows.sort((a, b) => {
        const aValue = a.children[columnIndex].textContent;
        const bValue = b.children[columnIndex].textContent;
        if (isNaN(parseFloat(aValue)) || isNaN(parseFloat(bValue))) {
            return ascending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            return ascending ? parseFloat(aValue) - parseFloat(bValue) : parseFloat(bValue) - parseFloat(aValue);
        }
    });
    // Reorder table rows
    tableBody.innerHTML = '';
    rows.forEach(row => tableBody.appendChild(row));
}

// Add sorting arrows next to headers
const sortArrows = ['|', '&#8593;', '&#8595;']; // Up arrow, down arrow, no arrow
tableHeaders.forEach((headerText, index) => {
    console.log(headerText)
    const th = document.createElement('th');
    if(headerText==='Country name'||headerText==='Area'){
    th.innerHTML =` ${headerText} <span class="sort-arrow">${sortArrows[2]}</span>`;
}else{
    th.innerHTML =` ${headerText}`;
}
    th.addEventListener('click', () => {
        const currentArrow = th.querySelector('.sort-arrow');
        const isAscending =  currentArrow.innerHTML === sortArrows[2]||currentArrow.innerHTML === sortArrows[0];    
        sortTable(index, !isAscending);
        // Update arrow direction
       
        currentArrow.innerHTML = isAscending ? sortArrows[1] :sortArrows[0];
        //Reset arrow direction for other headers
        // tableHeaders.forEach((h, i) => {
        //     if (i !== index) {
        //         const arrow = table.querySelector(`th:nth-child(${i+1}).sort-arrow`);
        //         if (arrow) arrow.innerHTML = sortArrows[2];
        //     }
        // });
    });
    tableHeaderRow.appendChild(th);
});

table.appendChild(tableBody);

// Append form and table to the document body
document.body.appendChild(form);
document.body.appendChild(table);

