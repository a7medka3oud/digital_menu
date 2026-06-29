(function () {
  const STORAGE_KEY = "smart-burger-menu:data";
  const Vue = window.Vue;

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function readSavedData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn("Could not read saved menu data.", error);
      return null;
    }
  }

  function normalizeData(data) {
    const fallback = clone(window.DEFAULT_MENU_DATA);
    const categories = Array.isArray(data.categories) && data.categories.length
      ? clone(data.categories)
      : fallback.categories;
    const items = Array.isArray(data.items) ? clone(data.items) : fallback.items;

    return {
      brand: { ...fallback.brand, ...(data.brand || {}) },
      theme: { ...fallback.theme, ...(data.theme || {}) },
      settings: { ...fallback.settings, ...(data.settings || {}) },
      categories,
      items
    };
  }

  function makeId(prefix) {
    if (window.crypto && window.crypto.randomUUID) {
      return `${prefix}-${window.crypto.randomUUID().slice(0, 8)}`;
    }
    return `${prefix}-${Date.now().toString(36)}`;
  }

  Vue.createApp({
    data() {
      return {
        data: normalizeData(readSavedData() || window.DEFAULT_MENU_DATA),
        activeCategory: "all",
        search: "",
        cart: {},
        showCart: false,
        editMode: false,
        copied: false,
        saveState: "محفوظ",
        saveTimer: null
      };
    },

    computed: {
      themeVars() {
        return {
          "--primary": this.data.theme.primary,
          "--accent": this.data.theme.accent,
          "--gold": this.data.theme.gold,
          "--background": this.data.theme.background,
          "--surface": this.data.theme.surface,
          "--ink": this.data.theme.ink,
          "--muted": this.data.theme.muted
        };
      },

      heroBackground() {
        return `linear-gradient(90deg, rgba(18, 15, 12, .86), rgba(18, 15, 12, .38), rgba(18, 15, 12, .06)), url("${this.data.brand.heroImage}")`;
      },

      categoriesWithAll() {
        const list = this.data.categories.map((category) => ({
          ...category,
          count: this.data.items.filter((item) => item.categoryId === category.id).length
        }));
        return [
          { id: "all", name: "الكل", shortName: "الكل", count: this.data.items.length },
          ...list
        ];
      },

      filteredItems() {
        const term = this.search.toLowerCase();
        return this.data.items.filter((item) => {
          const inCategory = this.activeCategory === "all" || item.categoryId === this.activeCategory;
          const text = `${item.name} ${item.description} ${this.categoryName(item.categoryId)}`.toLowerCase();
          return inCategory && (!term || text.includes(term));
        });
      },

      orderLines() {
        return Object.entries(this.cart)
          .map(([itemId, quantity]) => ({
            item: this.data.items.find((item) => item.id === itemId),
            quantity
          }))
          .filter((line) => line.item && line.quantity > 0);
      },

      orderCount() {
        return this.orderLines.reduce((sum, line) => sum + line.quantity, 0);
      },

      subtotal() {
        return this.orderLines.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
      },

      tax() {
        return this.subtotal * (Number(this.data.settings.taxRate) || 0) / 100;
      },

      total() {
        return this.subtotal + this.tax;
      },

      estimatedPrep() {
        const base = Number(this.data.settings.minimumPrep) || 12;
        const perItem = Number(this.data.settings.averagePrepPerItem) || 3;
        return Math.max(base, base + Math.max(0, this.orderCount - 1) * perItem);
      }
    },

    watch: {
      data: {
        deep: true,
        handler() {
          this.queueSave();
        }
      }
    },

    mounted() {
      document.documentElement.style.setProperty("color-scheme", "light");
    },

    methods: {
      categoryName(categoryId) {
        return this.data.categories.find((category) => category.id === categoryId)?.name || "منيو";
      },

      photoStyle(item) {
        return {
          backgroundImage: `url("${this.data.brand.heroImage}")`,
          backgroundPosition: item.photoPosition || "center",
          backgroundColor: this.data.theme.primary
        };
      },

      formatPrice(value) {
        const amount = new Intl.NumberFormat("ar-EG", {
          minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
          maximumFractionDigits: 2
        }).format(Number(value) || 0);
        return `${amount} ${this.data.settings.currency}`;
      },

      addToCart(item) {
        if (!item.available) return;
        this.increment(item.id);
        this.showCart = true;
      },

      increment(itemId) {
        this.cart[itemId] = (this.cart[itemId] || 0) + 1;
      },

      decrement(itemId) {
        if (!this.cart[itemId]) return;
        this.cart[itemId] -= 1;
        if (this.cart[itemId] <= 0) {
          delete this.cart[itemId];
        }
      },

      toggleCart() {
        this.showCart = !this.showCart;
      },

      clearFilters() {
        this.search = "";
        this.activeCategory = "all";
      },

      queueSave() {
        this.saveState = "جار الحفظ...";
        window.clearTimeout(this.saveTimer);
        this.saveTimer = window.setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
          this.saveState = "محفوظ";
        }, 250);
      },

      resetData() {
        this.data = clone(window.DEFAULT_MENU_DATA);
        this.cart = {};
        localStorage.removeItem(STORAGE_KEY);
        this.saveState = "تمت الاستعادة";
      },

      addCategory() {
        const id = makeId("category");
        this.data.categories.push({
          id,
          name: "قسم جديد",
          shortName: "جديد",
          accent: this.data.theme.accent
        });
        this.activeCategory = id;
      },

      removeCategory(categoryId) {
        if (this.data.categories.length <= 1) return;
        const fallbackId = this.data.categories.find((category) => category.id !== categoryId)?.id;
        this.data.items.forEach((item) => {
          if (item.categoryId === categoryId) {
            item.categoryId = fallbackId;
          }
        });
        this.data.categories = this.data.categories.filter((category) => category.id !== categoryId);
        if (this.activeCategory === categoryId) {
          this.activeCategory = "all";
        }
      },

      addItem() {
        const firstCategory = this.data.categories[0]?.id || "burgers";
        this.data.items.unshift({
          id: makeId("item"),
          categoryId: firstCategory,
          name: "صنف جديد",
          description: "وصف مختصر للصنف.",
          price: 0,
          available: true,
          popular: false,
          photoPosition: "50% 70%"
        });
      },

      removeItem(itemId) {
        this.data.items = this.data.items.filter((item) => item.id !== itemId);
        delete this.cart[itemId];
      },

      uploadLogo(event) {
        this.readImage(event, (result) => {
          this.data.brand.logo = result;
        });
      },

      uploadHero(event) {
        this.readImage(event, (result) => {
          this.data.brand.heroImage = result;
        });
      },

      readImage(event, callback) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => callback(reader.result);
        reader.readAsDataURL(file);
        event.target.value = "";
      },

      exportData() {
        const blob = new Blob([JSON.stringify(this.data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "smart-burger-menu-data.json";
        link.click();
        URL.revokeObjectURL(url);
      },

      importData(event) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          try {
            this.data = normalizeData(JSON.parse(reader.result));
            this.saveState = "تم الاستيراد";
          } catch (error) {
            this.saveState = "ملف غير صالح";
          }
        };
        reader.readAsText(file);
        event.target.value = "";
      },

      copyOrder() {
        const lines = this.orderLines.map((line) => `${line.quantity} × ${line.item.name}`);
        const text = [
          this.data.brand.name,
          ...lines,
          `الإجمالي: ${this.formatPrice(this.total)}`
        ].join("\n");

        const fallbackCopy = () => {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "readonly");
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          area.remove();
          this.copied = true;
          window.setTimeout(() => {
            this.copied = false;
          }, 1600);
        };

        if (!navigator.clipboard) {
          fallbackCopy();
          return;
        }

        navigator.clipboard.writeText(text).then(() => {
          this.copied = true;
          window.setTimeout(() => {
            this.copied = false;
          }, 1600);
        }).catch(fallbackCopy);
      }
    }
  }).mount("#app");
})();
