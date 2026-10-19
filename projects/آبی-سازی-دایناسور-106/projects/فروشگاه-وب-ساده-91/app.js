const products = [
  { id: 1, name: 'ماگ سرامیکی آفتاب', category: 'خانه', description: 'ساخته‌شده برای لحظه‌های آرام صبحگاهی', price: 385000, icon: '☕' },
  { id: 2, name: 'کیف روزمره نیکا', category: 'پوشیدنی', description: 'سبک، جادار و مناسب استفاده روزانه', price: 890000, icon: '👜' },
  { id: 3, name: 'چراغ مطالعه نوری', category: 'خانه', description: 'نور گرم با طراحی مینیمال و کاربردی', price: 670000, icon: '♨' },
  { id: 4, name: 'هدفون بی‌سیم موج', category: 'دیجیتال', description: 'صدایی شفاف برای مسیرهای طولانی', price: 1250000, icon: '◉' },
  { id: 5, name: 'بطری آب همراه', category: 'سلامت', description: 'همراهی مطمئن برای سبک زندگی سالم', price: 420000, icon: '♢' },
  { id: 6, name: 'دفتر یادداشت نقطه‌ای', category: 'خانه', description: 'برای ایده‌هایی که ارزش ماندن دارند', price: 245000, icon: '▤' },
  { id: 7, name: 'عینک آفتابی آرکا', category: 'پوشیدنی', description: 'فرمی ساده با محافظت کامل از چشم', price: 780000, icon: '⌁' },
  { id: 8, name: 'پایه رومیزی موبایل', category: 'دیجیتال', description: 'نظم بیشتر روی میز کار شما', price: 315000, icon: '▱' }
];

function formatPrice(value) {
  return new Intl.NumberFormat('fa-IR').format(value) + ' تومان';
}

function filterProducts(items, query = '', category = 'all') {
  const normalized = query.trim().toLocaleLowerCase('fa');
  return items.filter((item) => {
    const matchesQuery = !normalized || `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase('fa').includes(normalized);
    const matchesCategory = category === 'all' || item.category === category;
    return matchesQuery && matchesCategory;
  });
}

function validateLogin(email, password) {
  if (!email || !email.includes('@') || !email.includes('.')) return 'لطفاً یک ایمیل معتبر وارد کنید.';
  if (!password || password.length < 6) return 'رمز عبور باید حداقل ۶ کاراکتر باشد.';
  return '';
}

function renderProducts(items) {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('empty-state');
  if (!grid) return;
  grid.innerHTML = items.map((item) => `<article class="product-card"><div class="product-image" aria-hidden="true">${item.icon}</div><div class="product-info"><h3>${item.name}</h3><p>${item.description}</p><div class="product-footer"><span class="price">${formatPrice(item.price)}</span><button class="add-button" type="button" data-product="${item.id}">افزودن به علاقه‌مندی</button></div></div></article>`).join('');
  if (empty) empty.hidden = items.length > 0;
}

if (typeof document !== 'undefined') {
  const search = document.getElementById('search-input');
  const category = document.getElementById('category-filter');
  const modal = document.getElementById('login-modal');
  const toast = document.getElementById('toast');
  const updateProducts = () => renderProducts(filterProducts(products, search.value, category.value));
  renderProducts(products);
  search.addEventListener('input', updateProducts);
  category.addEventListener('change', updateProducts);
  document.getElementById('open-login').addEventListener('click', () => { modal.hidden = false; document.getElementById('email').focus(); });
  document.getElementById('close-login').addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.hidden = true; });
  document.getElementById('login-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const error = validateLogin(email, password);
    document.getElementById('form-error').textContent = error;
    if (!error) { modal.hidden = true; toast.textContent = 'ورود نمایشی با موفقیت انجام شد.'; toast.classList.add('show'); event.target.reset(); setTimeout(() => toast.classList.remove('show'), 2800); }
  });
  document.addEventListener('click', (event) => {
    if (event.target.matches('.add-button')) { toast.textContent = 'محصول به علاقه‌مندی‌ها اضافه شد.'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); }
  });
}

if (typeof module !== 'undefined') module.exports = { products, formatPrice, filterProducts, validateLogin };
