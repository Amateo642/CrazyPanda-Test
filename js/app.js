const ROWS_PER_PAGE = 20;
let COLS;

let SAVED_DATA;

let CURRENT_PAGE = 1;
let TOTAL_PAGES;

let FILTER = '';

let SORTED = 'none';// asc and desc
let SORTED_BY;

// Рендер таблицы

function createRows(tableData) {
    const tableBody = document.querySelector('tbody');

    tableBody.innerHTML = '';

    tableData.forEach(rowData => {
        tableBody.appendChild(createRow(rowData));
    });
}

function createRow(rowData) {
    const tr = document.createElement('tr');

    COLS.forEach(key => {
        tr.appendChild(createCell(rowData[key]));
    });
    
    return tr;
}

function createCell(value) {
    const td = document.createElement('td');
    td.innerText = value;
    return td;
}

function renderPage() {
    const filteredData = getFilteredData(SAVED_DATA);
    const sortedData = getSortedData(filteredData);
    const slice = sortedData.slice(CURRENT_PAGE * ROWS_PER_PAGE - ROWS_PER_PAGE, CURRENT_PAGE * ROWS_PER_PAGE);

    createRows(slice);
    checkButtons();
    pageInput.value = CURRENT_PAGE; 
    TOTAL_PAGES = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    pageTotal.innerText = ` / ${TOTAL_PAGES}`;
}

function renderTableHead() {
    const tableHead = document.querySelector('thead');
    const tr = document.createElement('tr');

    COLS.forEach(colName => {
        const th = document.createElement('th');
        th.innerText = colName;
        tr.appendChild(th);
    });

    tableHead.appendChild(tr);
    addHeaderListeners();
}

function renderTableBody() {
    CURRENT_PAGE = 1;
    renderPage();
}

// Получение данных и старт приложения

function get() {
    //return fetch('https://jsonplaceholder.typicode.com/todos')
    return fetch('https://jsonplaceholder.typicode.com/comments')
        .then(response => response.json());
}

get().then(data => {
    SAVED_DATA = data;
    COLS = Object.keys(data[0]);
    renderTableHead();
    renderTableBody();
});

// Пагинация

const pageTotal = document.querySelector('.page-total');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const pageInput = document.querySelector('.page-input');

function checkButtons() {
    if(CURRENT_PAGE < TOTAL_PAGES) {
        nextButton.disabled = false;
    }

    if(CURRENT_PAGE === 1) {
        prevButton.disabled = true;
    }

    if(CURRENT_PAGE > 1) {
        prevButton.disabled = false;
    }

    if(CURRENT_PAGE === TOTAL_PAGES) {
        nextButton.disabled = true;
    }
}

prevButton.addEventListener('click', () => {
    --CURRENT_PAGE;
    renderPage();
});

nextButton.addEventListener('click', () => {
    ++CURRENT_PAGE;
    renderPage();
});

pageInput.addEventListener('change', (e) => {
    const newPage = Number(e.target.value);
    if(newPage > 0 && newPage <= TOTAL_PAGES) {
        CURRENT_PAGE = newPage;
        renderPage();
    }
});

// Фильтрация

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('change', (e) => {
    FILTER = e.target.value;
    renderTableBody();
});

function getFilteredData(data) {
    return data.filter(element => {
        
        for(value of Object.values(element)) {
            if (String(value).includes(FILTER)) {
                return true;
            }
        }
       
        return false;
    });
};

// Сортировка

function getSortedData(data) {
    if (SORTED === 'none') {
        return data;
    }

    return data.sort((a, b) =>  {
        if (SORTED === 'asc') {
            if (a[SORTED_BY] > b[SORTED_BY]) {
                return 1;
            }
            if (a[SORTED_BY] < b[SORTED_BY]) {
                return -1;
            }
        }
        if (SORTED === 'desc') {
            if (a[SORTED_BY] > b[SORTED_BY]) {
                return -1;
            }
            if (a[SORTED_BY] < b[SORTED_BY]) {
                return 1;
            }
        }
        return 0;
    });
}

function renderSortedPage(key) {
    if (SORTED_BY !== key) {
        SORTED = 'none';
        SORTED_BY = key;
    }

    if (SORTED === 'none') {
        SORTED = 'asc';
    } else if (SORTED === 'asc') {
        SORTED = 'desc';
    } else {
        SORTED = 'none';
    }

    renderPage();
}

function addHeaderListeners() {
    const headers = document.querySelectorAll('th');
    headers.forEach((header) => {
        header.addEventListener('click', () => {
            renderSortedPage(header.innerText);
            if (SORTED === 'none') {
                header.className = '';
            } else if (SORTED === 'asc') {
                header.className = 'asc';
            } else {
                header.className = 'desc';
            }
        });
    });
}
