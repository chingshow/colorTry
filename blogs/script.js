let articles = [];
let currentPage = 1;
const articlesPerPage = 25;
let currentFilter = null;
let currentFilterType = null;
let currentFilterValue = null;

// 從 JSON 文件加載文章元數據
fetch('content.json')
    .then(response => response.json())
    .then(data => {
        articles = data.articles;
        document.getElementById('title').textContent = data.title;
        displayArticles(currentPage);
        updatePagination();
        populateSidebar();
        updateFilterStatus();
    })
    .catch(error => console.error('Error loading articles:', error));

document.getElementById('homePage').addEventListener('click', function(e) {
    e.preventDefault();
    resetToHomePage();
});

function resetToHomePage() {
    currentPage = 1;
    currentFilter = null;
    currentFilterType = null;
    currentFilterValue = null;
    displayArticles(currentPage);
    updatePagination();
    updateFilterStatus();
    scrollToTop();
}


function displayArticles(page) {
    const start = (page - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const articleContainer = document.getElementById('articles');
    articleContainer.innerHTML = '';

    const displayedArticles = currentFilter ? currentFilter : articles;

    for (let i = start; i < end && i < displayedArticles.length; i++) {
        const article = displayedArticles[i];
        const articleElement = document.createElement('a');
        articleElement.className = 'article';
        articleElement.href = `./documents/${article.no}.html`;
        articleElement.target = '_blank';
        articleElement.innerHTML = `
            <h2>${article.titles}</h2>
            <div class="article-meta">
                作者: ${article.author} | 日期: ${article.date} | 標籤: ${article.tags.join(', ')}
            </div>
        `;
        articleContainer.appendChild(articleElement);
    }
    window.scrollTo(0, 0);
}

function updatePagination() {
    const totalArticles = currentFilter ? currentFilter.length : articles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;

    // 更新當前頁碼顯示
    document.getElementById('currentPage').textContent = `第 ${currentPage} 頁,共 ${totalPages} 頁`;
}
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayArticles(currentPage);
        updatePagination();
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    const totalArticles = currentFilter ? currentFilter.length : articles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayArticles(currentPage);
        updatePagination();
    }
});

function populateSidebar() {
    const dateArchive = document.getElementById('dateArchive');
    const tagList = document.getElementById('tagList');
    const dates = new Set();
    const tags = new Set();

    articles.forEach(article => {
        const date = article.date.substring(0, 7); // 取得年/月
        dates.add(date);
        article.tags.forEach(tag => tags.add(tag));
    });

    dates.forEach(date => {
        const li = document.createElement('li');
        li.textContent = date;
        li.addEventListener('click', () => filterArticles('date', date));
        dateArchive.appendChild(li);
    });

    tags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;
        li.addEventListener('click', () => filterArticles('tag', tag));
        tagList.appendChild(li);
    });
}

function filterArticles(type, value) {
    currentFilter = articles.filter(article => {
        if (type === 'date') {
            return article.date.startsWith(value);
        } else if (type === 'tag') {
            return article.tags.includes(value);
        }
    });

    currentFilterType = type;
    currentFilterValue = value;
    currentPage = 1;
    displayArticles(currentPage);
    updatePagination();
    updateFilterStatus();
}

function clearFilter() {
    currentFilter = null;
    currentFilterType = null;
    currentFilterValue = null;
    currentPage = 1;
    displayArticles(currentPage);
    updatePagination();
    updateFilterStatus();
    resetToHomePage();

}

function updateFilterStatus() {
    const filterStatus = document.getElementById('filterStatus');
    if (currentFilter) {
        let statusText = currentFilterType === 'date' ? '日期篩選: ' : '標籤篩選: ';
        statusText += currentFilterValue;
        filterStatus.innerHTML = `
            ${statusText} 
            <button onclick="clearFilter()">清除篩選</button>
        `;
    } else {
        filterStatus.innerHTML = '顯示所有文章';
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

document.getElementById('backToTop').addEventListener('click', function(e) {
    e.preventDefault();
    scrollToTop();
});

function adjustSidebarHeight() {
    const sidebar = document.getElementById('sidebar');
    const sidebarContent = document.getElementById('sidebarContent');
    const stickyImageContainer = document.getElementById('stickyImageContainer');

    const availableHeight = sidebar.offsetHeight;
    const imageHeight = stickyImageContainer.offsetHeight;

    sidebarContent.style.maxHeight = `${availableHeight - imageHeight}px`;
}

window.addEventListener('load', adjustSidebarHeight);
window.addEventListener('resize', adjustSidebarHeight);