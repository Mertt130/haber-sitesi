import { auth, db, storage, analytics } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    serverTimestamp,
    updateDoc,
    deleteDoc,
    doc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import {
    ref,
    uploadBytes,
    getDownloadURL
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // Auth state değişikliklerini dinle
    onAuthStateChanged(auth, (user) => {
        if (user) {
            document.getElementById('loginForm').classList.add('d-none');
            document.getElementById('adminPanel').classList.remove('d-none');
            loadDashboard();
            loadCategories();
        } else {
            document.getElementById('loginForm').classList.remove('d-none');
            document.getElementById('adminPanel').classList.add('d-none');
        }
    });

    // Login form submit
    document.getElementById('adminLogin').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('adminEmail').value;
        const password = document.getElementById('adminPassword').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            alert('Giriş başarısız: ' + error.message);
        }
    });

    // Çıkış butonu
    document.getElementById('logoutBtn').addEventListener('click', () => {
        signOut(auth);
    });

    // Yeni kategori ekleme
    document.getElementById('addCategoryBtn').addEventListener('click', async () => {
        const categoryName = prompt('Yeni kategori adı:');
        if (categoryName) {
            try {
                await addDoc(collection(db, 'categories'), {
                    name: categoryName,
                    createdAt: serverTimestamp()
                });
                loadCategories();
            } catch (error) {
                alert('Kategori eklenirken hata oluştu: ' + error.message);
            }
        }
    });

    // Haber ekleme formu
    document.getElementById('addNewsForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newsData = {
            title: document.getElementById('title').value,
            content: document.getElementById('content').value,
            category: document.getElementById('category').value,
            videoUrl: document.getElementById('videoUrl').value,
            tags: document.getElementById('tags').value.split(',').map(tag => tag.trim()),
            publishDate: document.getElementById('publishDate').value || new Date().toISOString(),
            featured: document.getElementById('featured').checked,
            breaking: document.getElementById('breaking').checked,
            createdAt: serverTimestamp(),
            author: auth.currentUser.email,
            views: 0,
            comments: []
        };

        try {
            // Resim yükleme
            const imageFile = document.getElementById('image').files[0];
            if (imageFile) {
                const imageRef = ref(storage, `news_images/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(imageRef, imageFile);
                newsData.imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Haberi kaydet
            await addDoc(collection(db, 'news'), newsData);
            alert('Haber başarıyla eklendi!');
            e.target.reset();
            loadDashboard();
        } catch (error) {
            alert('Haber eklenirken hata oluştu: ' + error.message);
        }
    });
});

// Dashboard verilerini yükle
async function loadDashboard() {
    try {
        // Toplam haber sayısı
        const newsSnapshot = await getDocs(collection(db, 'news'));
        document.getElementById('totalNews').textContent = newsSnapshot.size;

        // Toplam yorum sayısı
        const commentsSnapshot = await getDocs(collection(db, 'comments'));
        document.getElementById('totalComments').textContent = commentsSnapshot.size;

        // Bugünkü görüntülenme
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const viewsQuery = query(
            collection(db, 'views'),
            where('timestamp', '>=', today)
        );
        const viewsSnapshot = await getDocs(viewsQuery);
        let todayViews = 0;
        viewsSnapshot.forEach(doc => {
            todayViews += doc.data().count;
        });
        document.getElementById('todayViews').textContent = todayViews;

        // Aktif kullanıcılar (son 5 dakika)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsersQuery = query(
            collection(db, 'active_users'),
            where('lastActive', '>=', fiveMinutesAgo)
        );
        const activeUsersSnapshot = await getDocs(activeUsersQuery);
        document.getElementById('activeUsers').textContent = activeUsersSnapshot.size;
    } catch (error) {
        console.error('Dashboard yüklenirken hata:', error);
    }
}

// Kategorileri yükle
async function loadCategories() {
    try {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Kategori Seçin</option>';

        const categoriesSnapshot = await getDocs(
            query(collection(db, 'categories'), orderBy('name'))
        );

        categoriesSnapshot.forEach(doc => {
            const category = doc.data();
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
    }
}
