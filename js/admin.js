// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD0R5K1FuXOhaVjzzCqNov9DR2CYNqigqc",
    authDomain: "ticketbookingwebsite.firebaseapp.com",
    projectId: "ticketbookingwebsite",
    storageBucket: "ticketbookingwebsite.appspot.com",
    messagingSenderId: "1032821918724",
    appId: "1:1032821918724:web:48a077982a965f41387951",
    measurementId: "G-B9J3ZFG7X3"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// DOM Elements
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const searchInput = document.getElementById('searchInput');
const contactsContent = document.getElementById('contactsContent');
const paymentsContent = document.getElementById('paymentsContent');
const contactsTableBody = document.getElementById('contactsTableBody');
const paymentsTableBody = document.getElementById('paymentsTableBody');
const contactsTab = document.querySelector('.tab[data-tab="contacts"]');
const paymentsTab = document.querySelector('.tab[data-tab="payments"]');
const exportContacts = document.getElementById('exportContacts');
const exportPayments = document.getElementById('exportPayments');
const confirmationModal = document.getElementById('confirmationModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
const toggleDeleteBtn = document.getElementById('toggleDeleteBtn');

let contacts = [];
let payments = [];
let currentDeleteItem = null;
let showDeleteButtons = false;

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = 'chetan23rd@admin.com';
    const password = passwordInput.value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log('Login successful');
            showDashboard();
            fetchData();
        })
        .catch((error) => {
            console.error('Login error:', error);
            alert('Login failed. Please check your password and try again.');
        });
});

// Auth State Change Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        showDashboard();
        fetchData();
    } else {
        showLogin();
    }
});

// Show/Hide Functions
function showLogin() {
    loginContainer.classList.remove('hidden');
    dashboardContainer.classList.add('hidden');
}

function showDashboard() {
    loginContainer.classList.add('hidden');
    dashboardContainer.classList.remove('hidden');
}

// Fetch Data from Firestore
async function fetchData() {
    try {
        const contactsSnapshot = await db.collection('contacts').orderBy('timestamp', 'desc').get();
        const paymentsSnapshot = await db.collection('payments').orderBy('timestamp', 'desc').get();

        contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        payments = paymentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderContacts();
        renderPayments();
        updateUnreadCounts();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Render Functions
function renderContacts() {
    contactsTableBody.innerHTML = contacts.map((contact, index) => `
        <tr>
            <td>${contact.name || 'N/A'}</td>
            <td>${contact.passes || 'N/A'}</td>
            <td>${contact.mobile || 'N/A'}</td>
            <td class="action-column ${showDeleteButtons ? '' : 'hidden'}">
                <button class="action-btn delete-btn" onclick="showDeleteConfirmation('contacts', '${contact.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function renderPayments() {
    paymentsTableBody.innerHTML = payments.map((payment, index) => `
        <tr>
            <td>${payment.name || 'N/A'}</td>
            <td>${payment.dateOfPasses || 'N/A'}</td>
            <td>₹${payment.amountPaid || 'N/A'}</td>
            <td>${payment.contactNumber || 'N/A'}</td>
            <td>${payment.upirefid || 'N/A'}</td>
            <td class="action-column ${showDeleteButtons ? '' : 'hidden'}">
                <button class="action-btn delete-btn" onclick="showDeleteConfirmation('payments', '${payment.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateUnreadCounts() {
    const unreadContacts = contacts.filter(contact => !contact.isRead).length;
    const unreadPayments = payments.filter(payment => !payment.isRead).length;

    contactsTab.textContent = `Contacts ${unreadContacts > 0 ? `(${unreadContacts})` : ''}`;
    paymentsTab.textContent = `Payments ${unreadPayments > 0 ? `(${unreadPayments})` : ''}`;
}

// Delete Functionality
function showDeleteConfirmation(type, id) {
    currentDeleteItem = { type, id };
    confirmationModal.classList.remove('hidden');
}

confirmDelete.addEventListener('click', () => {
    if (currentDeleteItem) {
        deleteItem(currentDeleteItem.type, currentDeleteItem.id);
    }
    confirmationModal.classList.add('hidden');
});

cancelDelete.addEventListener('click', () => {
    confirmationModal.classList.add('hidden');
});

async function deleteItem(type, id) {
    try {
        await db.collection(type).doc(id).delete();
        if (type === 'contacts') {
            contacts = contacts.filter(contact => contact.id !== id);
            renderContacts();
        } else if (type === 'payments') {
            payments = payments.filter(payment => payment.id !== id);
            renderPayments();
        }
        updateUnreadCounts();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item. Please try again.');
    }
}

// Toggle Delete Buttons
toggleDeleteBtn.addEventListener('click', () => {
    showDeleteButtons = !showDeleteButtons;
    toggleDeleteBtn.textContent = showDeleteButtons ? 'Hide Delete Options' : 'Show Delete Options';
    document.querySelectorAll('.action-column').forEach(col => {
        col.classList.toggle('hidden');
    });
    renderContacts();
    renderPayments();
});

// Search Functionality
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filterTable(contactsTableBody, contacts, searchTerm, renderContactRow);
    filterTable(paymentsTableBody, payments, searchTerm, renderPaymentRow);
});

function filterTable(tableBody, data, searchTerm, renderRow) {
    const filteredData = data.filter(item => 
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchTerm)
        )
    );
    tableBody.innerHTML = filteredData.map(renderRow).join('');
}

function renderContactRow(contact) {
    return `
        <tr>
            <td>${contact.name || 'N/A'}</td>
            <td>${contact.passes || 'N/A'}</td>
            <td>${contact.mobile || 'N/A'}</td>
            <td class="action-column ${showDeleteButtons ? '' : 'hidden'}">
                <button class="action-btn delete-btn" onclick="showDeleteConfirmation('contacts', '${contact.id}')">Delete</button>
            </td>
        </tr>
    `;
}

function renderPaymentRow(payment) {
    return `
        <tr>
            <td>${payment.name || 'N/A'}</td>
            <td>${payment.dateOfPasses || 'N/A'}</td>
            <td>₹${payment.amountPaid || 'N/A'}</td>
            <td>${payment.contactNumber || 'N/A'}</td>
            <td>${payment.upirefid || 'N/A'}</td>
            <td class="action-column ${showDeleteButtons ? '' : 'hidden'}">
                <button class="action-btn delete-btn" onclick="showDeleteConfirmation('payments', '${payment.id}')">Delete</button>
            </td>
        </tr>
    `;
}

// Tab Switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.content').forEach(content => content.classList.add('hidden'));
        document.getElementById(`${tab.dataset.tab}Content`).classList.remove('hidden');
    });
});

// Export to CSV Functionality
exportContacts.addEventListener('click', () => exportToCSV(contacts, 'contacts'));
exportPayments.addEventListener('click', () => exportToCSV(payments, 'payments'));

function exportToCSV(data, filename) {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function convertToCSV(data) {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(obj => Object.values(obj).join(','));
    return header + rows.join('\n');
}

// Initial setup
auth.onAuthStateChanged((user) => {
    if (user) {
        showDashboard();
        fetchData();
    } else {
        showLogin();
    }
});