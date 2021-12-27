const COLS = ['userId', 'id', 'title', 'completed'];
const ROWS_PER_PAGE = 20;
let savedData;
let filteredData;
let currentPage = 1;
let totalPages;

let sorted = 'none';// asc and desc
let sortedBy;

function get() {
    return fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json());
}

function createRows(tableData) {
    const table = document.querySelector('tbody');

    table.innerHTML = '';

    tableData.forEach(rowData => {
        table.appendChild(createRow(rowData));
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

function getSlice() {
    let resultData = getSortedData(filteredData);
    return resultData.slice(currentPage * ROWS_PER_PAGE - ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
}

function renderPage() {
    createRows(getSlice());
    checkButtons();
    console.log('cliked1');
    pageInput.value = currentPage; 
    pageTotal.innerText = ` / ${totalPages}`;
}

function renderTable() {
    totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE);
    currentPage = 1;
    renderPage();
}

get().then(data => {
    savedData = filteredData = data;
    renderTable();
});

/*
    Создаю обертку див в которм ограничение вьюпорта на 50 людей. 
    А остальное идет на некст стр. навигация по стр. со трелочками.

    1. выводить остальных на другие странички.
    2. соответс сделать другие странички.
    3. поставить ограничение 200 макс куррент.
    4. соответ возвращать некст пейдж на 4стр.
    5. можно добавить стили там дисейбл, поинтер курсоры.

    реализация.
    1. подсчитать кол-во стр. число записей/ на число выводимых на стр.
    2. при нажатии кнопок перерисовка таблицы в соответствие с текущей.
    2.1. создать ф-цию которая возвращает нужный отрез.
    2.2. очистить тек таблицу.
    2.3. заполняю таблицу из 2.1.
*/

const pageTotal = document.querySelector('.page-total');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const pageInput = document.querySelector('.page-input');

function checkButtons() {
    if(currentPage < totalPages) {
        nextButton.disabled = false;
    }

    if(currentPage === 1) {
        prevButton.disabled = true;
    }

    if(currentPage > 1) {
        prevButton.disabled = false;
    }

    if(currentPage === totalPages) {
        nextButton.disabled = true;
    }
}

prevButton.addEventListener('click', () => {
    --currentPage;
    renderPage();
});

nextButton.addEventListener('click', () => {
    ++currentPage;
    renderPage();
});

pageInput.addEventListener('change', (e) => {
    const newPage = Number(e.target.value);
    if(newPage > 0 && newPage <= totalPages) {
        currentPage = newPage;
        renderPage();
    }
});

/*
1. Добавить инпут в разметке. 
2. Настроить фильтр по инпуту.
3. Скрывать то что не дает фильтр.
4. Сделать синхронизацию между значениями полями.

1. Выводить на консоль значение инпута на каждое изменение.
2. Выводить на консоль массив после фильтрации.
3. Создать ф-цию фильтрующую массив. Строка сравнивается со всеми столбцами. метод подстроки
4. Передать в массив новый массив после фильтра.
*/ 

const searchInput = document.querySelector('.search-input');
searchInput.addEventListener('change', (e) => {
    const filter = e.target.value;
    //console.log(searchInput.value);
    filteredData = savedData.filter(element => {
        
        for(value of Object.values(element)) {
            if (String(value).includes(filter)) {
                return true;
            }
        }
       
        return false;
    });
    //console.log(filteredData);
    renderTable();
});

const userId = document.querySelector('#userId');
const id = document.querySelector('#id');
const title = document.querySelector('#title');
const completed = document.querySelector('#completed');

function getSortedData(data) {
    if (sorted === 'none') {
        sorted = 'asc';
    } else if (sorted === 'asc') {
        sorted = 'desc';
    } else {
        sorted = 'none';
    }

    if (sorted === 'none') {
        return data;
    }

    return data.sort((a, b) =>  {
        if (sorted === 'asc') {
            if (a[sortedBy] > b[sortedBy]) {
                return 1;
            }
            if (a[sortedBy] < b[sortedBy]) {
                return -1;
            }
        }
        if (sorted === 'desc') {
            if (a[sortedBy] > b[sortedBy]) {
                return -1;
            }
            if (a[sortedBy] < b[sortedBy]) {
                return 1;
            }
        }
        return 0;
    });
}

function renderSortedPage(key) {
    if (sortedBy !== key) {
        sorted = 'none';
        sortedBy = key;
    }

   console.log('clicked');
   renderPage();
}

userId.addEventListener('click', () => {
    renderSortedPage('userId');
});

id.addEventListener('click', () => {
    renderSortedPage('id');
});

title.addEventListener('click', () => {
    renderSortedPage('title');
});

completed.addEventListener('click', () => {
    renderSortedPage('completed');
});

/*function renderSortedPage () {
    if ((sortedBy) && (sorted)) {

    } 
    renderPage();
}*/

/*

1. СОРТИРОВКА


*/

/**
 * 1. Повесить на заголовки(4) обработчики события клик.
 * 2. В каждом обработчкие сортируем filteredData.
 * 3. Создать переменную для отсортиованной таблицы. sortedData / upd без нее
 * 4. После сортировки сохрянить в СортедДату и рендерим пейдж.upd в filteredData 
 * 5. Создать переменную sorted которая может быть 'none' 'asc' 'desc';
 * 6. Создать переменную sortedBy которой будет храниться ключ. По которому
 * я сортирую. Общая переменная по которой проверять сортировку других столбцов.
 * 7. renderSortedPage ф-ция которая проверяет sortedBy, sorted; после проверки
 * вызвать renderPage;
*/