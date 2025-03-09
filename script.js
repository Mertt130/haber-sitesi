import { auth, db, storage, analytics } from './firebase-config.js';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    increment,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// Karanlık Mod (Dark Mode) Özelliği
document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.createElement("button");
    darkModeToggle.innerText = "🌙 Dark Mode";
    darkModeToggle.style.position = "fixed";
    darkModeToggle.style.bottom = "10px";
    darkModeToggle.style.right = "10px";
    darkModeToggle.style.padding = "10px";
    darkModeToggle.style.cursor = "pointer";
    document.body.appendChild(darkModeToggle);

    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        if (document.body.classList.contains("dark-mode")) {
            darkModeToggle.innerText = "☀️ Light Mode";
        } else {
            darkModeToggle.innerText = "🌙 Dark Mode";
        }
    });
});

// CSS ile Dark Mode Stili
const darkModeStyle = document.createElement("style");
darkModeStyle.innerHTML = `
    .dark-mode {
        background: #121212;
        color: white;
    }
    .dark-mode header, .dark-mode footer {
        background: #1e1e1e;
    }
`;
document.head.appendChild(darkModeStyle);

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadBreakingNews();
    loadFeaturedNews();
    loadLatestNews();
    loadMostReadNews();
    loadCategories();
    loadWeatherData();
    setupSearchHandler();
});

// Son Dakika Haberlerini Yükle
async function loadBreakingNews() {
    try {
        const breakingNewsQuery = query(
            collection(db, 'news'),
            where('breaking', '==', true),
            orderBy('publishDate', 'desc'),
            limit(5)
        );

        const snapshot = await getDocs(breakingNewsQuery);
        const ticker = document.getElementById('breakingNewsTicker');
        let tickerHtml = '';

        snapshot.forEach(doc => {
            const news = doc.data();
            tickerHtml += `<span class="ticker-item">${news.title}</span>`;
        });

        ticker.innerHTML = tickerHtml;
        initializeNewsTicker();
    } catch (error) {
        console.error('Son dakika haberleri yüklenirken hata:', error);
    }
}

// Öne Çıkan Haberleri Yükle
async function loadFeaturedNews() {
    try {
        const featuredNewsQuery = query(
            collection(db, 'news'),
            where('featured', '==', true),
            orderBy('publishDate', 'desc'),
            limit(1)
        );

        const snapshot = await getDocs(featuredNewsQuery);
        const featuredNews = document.getElementById('featuredNews');

        if (!snapshot.empty) {
            const news = snapshot.docs[0].data();
            featuredNews.innerHTML = `
                <div class="card featured-news">
                    <img src="${news.imageUrl}" class="card-img-top" alt="${news.title}">
                    <div class="card-body">
                        <h2 class="card-title">${news.title}</h2>
                        <p class="card-text">${news.content.substring(0, 200)}...</p>
                        <button class="btn btn-primary" onclick="showNewsDetail('${snapshot.docs[0].id}')">
                            Devamını Oku
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Öne çıkan haberler yüklenirken hata:', error);
    }
}

// Son Haberleri Yükle
async function loadLatestNews() {
    try {
        const latestNewsQuery = query(
            collection(db, 'news'),
            orderBy('publishDate', 'desc'),
            limit(6)
        );

        const snapshot = await getDocs(latestNewsQuery);
        const latestNews = document.getElementById('latestNews');
        let newsHtml = '';

        snapshot.forEach(doc => {
            const news = doc.data();
            newsHtml += `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <img src="${news.imageUrl}" class="card-img-top" alt="${news.title}">
                        <div class="card-body">
                            <h5 class="card-title">${news.title}</h5>
                            <p class="card-text">${news.content.substring(0, 100)}...</p>
                            <button class="btn btn-sm btn-primary" onclick="showNewsDetail('${doc.id}')">
                                Devamını Oku
                            </button>
                        </div>
                        <div class="card-footer">
                            <small class="text-muted">
                                ${new Date(news.publishDate).toLocaleString('tr-TR')}
                            </small>
                        </div>
                    </div>
                </div>
            `;
        });

        latestNews.innerHTML = newsHtml;
    } catch (error) {
        console.error('Son haberler yüklenirken hata:', error);
    }
}

// Çok Okunan Haberleri Yükle
async function loadMostReadNews() {
    try {
        const mostReadQuery = query(
            collection(db, 'news'),
            orderBy('views', 'desc'),
            limit(5)
        );

        const snapshot = await getDocs(mostReadQuery);
        const mostReadNews = document.getElementById('mostReadNews');
        let newsHtml = '<ul class="list-unstyled">';

        snapshot.forEach(doc => {
            const news = doc.data();
            newsHtml += `
                <li class="mb-2">
                    <a href="#" onclick="showNewsDetail('${doc.id}'); return false;" class="text-decoration-none">
                        <div class="d-flex align-items-center">
                            <img src="${news.imageUrl}" class="me-2" style="width: 60px; height: 60px; object-fit: cover;">
                            <div>
                                <h6 class="mb-0">${news.title}</h6>
                                <small class="text-muted">${news.views} görüntülenme</small>
                            </div>
                        </div>
                    </a>
                </li>
            `;
        });

        newsHtml += '</ul>';
        mostReadNews.innerHTML = newsHtml;
    } catch (error) {
        console.error('Çok okunan haberler yüklenirken hata:', error);
    }
}

// Kategorileri Yükle
async function loadCategories() {
    try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoryMenu = document.getElementById('categoryMenu');
        const categoriesList = document.getElementById('categoriesList');
        
        let menuHtml = '';
        let listHtml = '<ul class="list-group list-group-flush">';

        categoriesSnapshot.forEach(doc => {
            const category = doc.data();
            menuHtml += `
                <li>
                    <a class="dropdown-item" href="#" onclick="filterByCategory('${doc.id}')">
                        ${category.name}
                    </a>
                </li>
            `;
            listHtml += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <a href="#" onclick="filterByCategory('${doc.id}')" class="text-decoration-none">
                        ${category.name}
                    </a>
                    <span class="badge bg-primary rounded-pill">${category.count || 0}</span>
                </li>
            `;
        });

        categoryMenu.innerHTML = menuHtml;
        listHtml += '</ul>';
        categoriesList.innerHTML = listHtml;
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
    }
}

// Haber Detayını Göster
async function showNewsDetail(newsId) {
    try {
        const newsDoc = await getDoc(doc(db, 'news', newsId));
        if (newsDoc.exists()) {
            const news = newsDoc.data();
            const modal = new bootstrap.Modal(document.getElementById('newsModal'));
            
            document.querySelector('#newsModal .modal-title').textContent = news.title;
            document.querySelector('#newsModal .modal-body').innerHTML = `
                <img src="${news.imageUrl}" class="img-fluid mb-3" alt="${news.title}">
                <div class="news-content">${news.content}</div>
                ${news.videoUrl ? `
                    <div class="ratio ratio-16x9 mt-3">
                        <iframe src="${news.videoUrl}" allowfullscreen></iframe>
                    </div>
                ` : ''}
            `;

            // Yorumları yükle
            loadComments(newsId);
            
            // Görüntülenme sayısını artır
            await updateDoc(doc(db, 'news', newsId), {
                views: increment(1)
            });

            modal.show();
        }
    } catch (error) {
        console.error('Haber detayı yüklenirken hata:', error);
    }
}

// Yorumları Yükle
async function loadComments(newsId) {
    try {
        const commentsQuery = query(
            collection(db, 'comments'),
            where('newsId', '==', newsId),
            orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(commentsQuery);
        const commentsList = document.getElementById('commentsList');
        let commentsHtml = '';

        snapshot.forEach(doc => {
            const comment = doc.data();
            commentsHtml += `
                <div class="comment mb-3">
                    <div class="d-flex justify-content-between">
                        <strong>${comment.author || 'Anonim'}</strong>
                        <small class="text-muted">
                            ${new Date(comment.timestamp.toDate()).toLocaleString('tr-TR')}
                        </small>
                    </div>
                    <p class="mb-0">${comment.text}</p>
                </div>
            `;
        });

        commentsList.innerHTML = commentsHtml || '<p class="text-muted">Henüz yorum yapılmamış.</p>';

        // Yorum formunu ayarla
        const commentForm = document.getElementById('commentForm');
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const commentText = document.getElementById('commentText').value;
            
            if (commentText.trim()) {
                try {
                    await addDoc(collection(db, 'comments'), {
                        newsId: newsId,
                        text: commentText,
                        timestamp: serverTimestamp(),
                        author: 'Anonim' // Kullanıcı girişi eklendiğinde değişecek
                    });
                    
                    document.getElementById('commentText').value = '';
                    loadComments(newsId); // Yorumları yeniden yükle
                } catch (error) {
                    console.error('Yorum eklenirken hata:', error);
                    alert('Yorum eklenirken bir hata oluştu.');
                }
            }
        };
    } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
    }
}

// Hava Durumu Verilerini Yükle
async function loadWeatherData() {
    try {
        // Hava durumu API'si entegrasyonu burada yapılacak
        const weatherWidget = document.getElementById('weatherWidget');
        weatherWidget.innerHTML = `
            <div class="text-center">
                <i class="fas fa-sun fa-2x text-warning"></i>
                <h3 class="mt-2">23°C</h3>
                <p class="mb-0">İstanbul</p>
                <small class="text-muted">Güneşli</small>
            </div>
        `;
    } catch (error) {
        console.error('Hava durumu verileri yüklenirken hata:', error);
    }
}

// Arama İşleyicisini Ayarla
function setupSearchHandler() {
    const searchForm = document.querySelector('form.d-flex');
    const searchInput = document.getElementById('searchInput');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();

        if (searchTerm) {
            try {
                const searchQuery = query(
                    collection(db, 'news'),
                    where('title', '>=', searchTerm),
                    where('title', '<=', searchTerm + '\uf8ff'),
                    limit(10)
                );

                const snapshot = await getDocs(searchQuery);
                const latestNews = document.getElementById('latestNews');
                let resultsHtml = '';

                if (snapshot.empty) {
                    resultsHtml = '<div class="col-12"><p class="text-center">Sonuç bulunamadı.</p></div>';
                } else {
                    snapshot.forEach(doc => {
                        const news = doc.data();
                        resultsHtml += `
                            <div class="col-md-6 mb-4">
                                <div class="card h-100">
                                    <img src="${news.imageUrl}" class="card-img-top" alt="${news.title}">
                                    <div class="card-body">
                                        <h5 class="card-title">${news.title}</h5>
                                        <p class="card-text">${news.content.substring(0, 100)}...</p>
                                        <button class="btn btn-sm btn-primary" onclick="showNewsDetail('${doc.id}')">
                                            Devamını Oku
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }

                latestNews.innerHTML = resultsHtml;
            } catch (error) {
                console.error('Arama yapılırken hata:', error);
                alert('Arama sırasında bir hata oluştu.');
            }
        }
    });
}

// Haber Ticker'ı Başlat
function initializeNewsTicker() {
    const ticker = document.getElementById('breakingNewsTicker');
    const items = ticker.getElementsByClassName('ticker-item');
    let currentIndex = 0;

    setInterval(() => {
        items[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % items.length;
        items[currentIndex].style.display = 'block';
    }, 3000);
}

// Kategori Filtreleme
async function filterByCategory(categoryId) {
    try {
        const newsQuery = query(
            collection(db, 'news'),
            where('category', '==', categoryId),
            orderBy('publishDate', 'desc'),
            limit(10)
        );

        const snapshot = await getDocs(newsQuery);
        const latestNews = document.getElementById('latestNews');
        let newsHtml = '';

        if (snapshot.empty) {
            newsHtml = '<div class="col-12"><p class="text-center">Bu kategoride haber bulunamadı.</p></div>';
        } else {
            snapshot.forEach(doc => {
                const news = doc.data();
                newsHtml += `
                    <div class="col-md-6 mb-4">
                        <div class="card h-100">
                            <img src="${news.imageUrl}" class="card-img-top" alt="${news.title}">
                            <div class="card-body">
                                <h5 class="card-title">${news.title}</h5>
                                <p class="card-text">${news.content.substring(0, 100)}...</p>
                                <button class="btn btn-sm btn-primary" onclick="showNewsDetail('${doc.id}')">
                                    Devamını Oku
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        latestNews.innerHTML = newsHtml;
    } catch (error) {
        console.error('Kategori filtrelenirken hata:', error);
    }
}

// Global fonksiyonları window nesnesine ekle
window.showNewsDetail = showNewsDetail;
window.filterByCategory = filterByCategory;
