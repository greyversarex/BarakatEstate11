export const auraPages = {
  home: `<div class="page active" id="page-home">

  <!-- HERO -->
  <section class="hero">
    <div class="hero-bg"></div>
    <div class="hero-pattern"></div>
    <div class="hero-grid"></div>
    <div class="hero-content">
      <div class="hero-left">
        <div class="hero-eyebrow">Недвижимость Душанбе</div>
        <h1 class="hero-title">
          Найди своё <em>идеальное</em>
          <strong>жильё в столице</strong>
        </h1>
        <p class="hero-sub">Аренда и продажа квартир в Душанбе. Только проверенные объявления, удобный поиск и карта объектов.</p>
        <div class="hero-actions">
          <button class="btn-primary" onclick="navigate('listings')">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="m21 21-4.35-4.35"/></svg>
            Найти квартиру
          </button>
          <button class="btn-secondary" onclick="navigate('map')">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
            Смотреть на карте
          </button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-num"><span class="total-num"></span><span>+</span></div>
            <div class="stat-label">Объявлений</div>
          </div>
          <div class="stat-item">
            <div class="stat-num"><span class="total-sellers"></span><span>+</span></div>
            <div class="stat-label">Продавцов</div>
          </div>
          <div class="stat-item">
            <div class="stat-num"><span class="total-districts"></span><span>+</span></div>
            <div class="stat-label">Районов</div>
          </div>
        </div>
      </div>
      <div class="hero-right">
        <div class="hero-cards">
          <div class="hero-cards-track">
            <!-- Main card -->
            <div class="hero-card hc-main" onclick="navigate('property')">
              <div class="hc-img">[[IMG_CITY]]</div>
              <div class="hc-tag">Продажа</div>
              <div class="hc-badge"></div>
              <div class="hc-body">
                <div class="hc-price">900 000 с</div>
                <div class="hc-addr">[[ICON_MAP_PIN]] Исмоили Сомони, 14</div>
                <div class="hc-meta">
                  <span>[[ICON_BED]] 3 комн</span>
                  <span>[[ICON_RULER]] 87 м²</span>
                  <span>[[ICON_CONSTRUCTION]] 2023</span>
                </div>
              </div>
            </div>
            <!-- Side card -->
            <div class="hero-card hc-side" onclick="navigate('property')">
              <div class="hc-img" style="height:55%">[[IMG_RENT]]</div>
              <div class="hc-tag">Аренда</div>
              <div class="hc-body">
                <div class="hc-price" style="font-size:18px">6 500 смн <small>/мес</small></div>
                <div class="hc-addr">[[ICON_MAP_PIN]] Центр</div>
                <div class="hc-meta">
                  <span>[[ICON_BED]] 2 комн</span>
                  <span>[[ICON_RULER]] 54 м²</span>
                  <span>[[ICON_PARKING]] Парковка</span>
                </div>
              </div>
            </div>
            <!-- Third card -->
            <div class="hero-card hc-third" onclick="navigate('property')">
              <div class="hc-img" style="height:55%"><img src='https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=700&q=80' alt='Интерьер квартиры' loading='lazy' /></div>
              <div class="hc-tag">Новинка</div>
              <div class="hc-body">
                <div class="hc-price" style="font-size:18px">750 000 смн</div>
                <div class="hc-addr">[[ICON_MAP_PIN]] Рудаки</div>
                <div class="hc-meta">
                  <span>[[ICON_BED]] 2 комн</span>
                  <span>[[ICON_RULER]] 72 м²</span>
                  <span>[[ICON_PARKING]] Парковка</span>
                </div>
              </div>
            </div>
            <!-- Fourth card -->
            <div class="hero-card" onclick="navigate('property')">
              <div class="hc-img" style="height:55%"><img src='https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=700&q=80' alt='Уютная гостиная' loading='lazy' /></div>
              <div class="hc-tag">Тренд</div>
              <div class="hc-body">
                <div class="hc-price" style="font-size:18px">920 000 смн</div>
                <div class="hc-addr">[[ICON_MAP_PIN]] Айнӣ</div>
                <div class="hc-meta">
                  <span>[[ICON_BED]] 3 комн</span>
                  <span>[[ICON_RULER]] 95 м²</span>
                  <span>[[ICON_PARKING]] Парковка</span>
                </div>
              </div>
            </div>
            <!-- Fifth card -->
            <div class="hero-card" onclick="navigate('property')">
              <div class="hc-img" style="height:55%"><img src='https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=700&q=80' alt='Современный интерьер' loading='lazy' /></div>
              <div class="hc-tag">Хит</div>
              <div class="hc-body">
                <div class="hc-price" style="font-size:18px">1 100 000 смн</div>
                <div class="hc-addr">[[ICON_MAP_PIN]] Шохмансур</div>
                <div class="hc-meta">
                  <span>[[ICON_BED]] 4 комн</span>
                  <span>[[ICON_RULER]] 128 м²</span>
                  <span>[[ICON_PARKING]] Парковка</span>
                </div>
              </div>
            </div>
          </div>
          <div class="hero-carousel-controls">
            <button class="hero-carousel-btn" type="button" onclick="slideHeroCards(-1)">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m11 4-4 4 4 4"/></svg>
            </button>
            <button class="hero-carousel-btn" type="button" onclick="slideHeroCards(1)">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 4 4 4-4 4"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- SEARCH -->
  <section class="search-section">
    <div class="search-wrap">
      <div class="search-tabs" style="gap: 8px; margin-bottom: 24px;">
        <button class="s-tab active" onclick="setSearchTab(this,'buy')" style="background: var(--gold); color: var(--ink);">Купить</button>
        <button class="s-tab" onclick="window.location.href='https://barakatestateadmin.vercel.app'">Продать</button>
        <button class="s-tab" onclick="setSearchTab(this,'rent')">Снять</button>
        <button class="s-tab" onclick="window.location.href='https://barakatestateadmin.vercel.app'">Сдать</button>
        <button class="s-tab" onclick="navigate('map')">На карте</button>
        <button class="s-tab" onclick="navigate('services')">Оценить</button>
        <button class="s-tab" onclick="navigate('services')">Сроч. выкуп</button>
      </div>
      <div class="search-row" style="align-items: center; gap: 12px;">
        <div style="flex: 1.2;">
          <select class="s-select" style="width: 100%; height: 48px; padding-left: 16px;">
            <option>Тип недвижимости</option>
            <option>Квартира</option>
            <option>Вторичка</option>
            <option>Новостройки</option>
            <option>Котлован</option>
            <option>Дома</option>
            <option>Дом</option>
            <option>Земельные участки</option>
            <option>Коммерческая</option>
            <option>Дача</option>
            <option>Парковка</option>
            <option>Комната</option>
          </select>
        </div>
        
        <!-- Dropdown for Rooms -->
        <div style="flex: 1; position: relative;" class="filter-dropdown-wrap">
          <div class="s-select" onclick="const menu = this.nextElementSibling; const isVisible = menu.style.display === 'block'; document.querySelectorAll('.filter-dropdown-menu').forEach(el => el.style.display = 'none'); if(!isVisible) menu.style.display = 'block'; event.stopPropagation();" style="width: 100%; height: 48px; display: flex; align-items: center; cursor: pointer; padding: 0 16px; justify-content: space-between;">
            <span style="color: var(--ink)" id="home-room-label" data-val="Любой">Комнат</span>
          </div>
          <div class="filter-dropdown-menu" style="display: none; position: absolute; top: 100%; left: 0; margin-top: 8px; background: white; border: 1px solid var(--border); border-radius: 16px; padding: 16px; width: 280px; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.08);" onclick="event.stopPropagation()">
            <div style="margin-bottom: 12px; font-weight: 600; font-size: 14px; color: var(--ink);">Количество комнат</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="home-room-chips">
              <div class="filter-chip active" onclick="selectHomeRoom(this, 'Любой')">Любой</div>
              <div class="filter-chip" onclick="selectHomeRoom(this, '1')">1</div>
              <div class="filter-chip" onclick="selectHomeRoom(this, '2')">2</div>
              <div class="filter-chip" onclick="selectHomeRoom(this, '3')">3</div>
              <div class="filter-chip" onclick="selectHomeRoom(this, '4')">4</div>
              <div class="filter-chip" onclick="selectHomeRoom(this, '5+')">5+</div>
            </div>
          </div>
        </div>

        <!-- Dropdown for Price -->
        <div style="flex: 1; position: relative;" class="filter-dropdown-wrap">
          <div class="s-select" onclick="const menu = this.nextElementSibling; const isVisible = menu.style.display === 'block'; document.querySelectorAll('.filter-dropdown-menu').forEach(el => el.style.display = 'none'); if(!isVisible) menu.style.display = 'block'; event.stopPropagation();" style="width: 100%; height: 48px; display: flex; align-items: center; cursor: pointer; padding: 0 16px; justify-content: space-between;">
            <span style="color: var(--ink)">Цена</span>
          </div>
          <div class="filter-dropdown-menu" style="display: none; position: absolute; top: 100%; left: 0; margin-top: 8px; background: white; border: 1px solid var(--border); border-radius: 16px; padding: 16px; width: 280px; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.08);" onclick="event.stopPropagation()">
            <div style="margin-bottom: 12px; font-weight: 600; font-size: 14px; color: var(--ink);">Диапазон цены</div>
            <div style="display: flex; gap: 8px;">
              <input class="s-input" placeholder="От" style="width: 50%; padding-left: 16px; padding-right: 12px;"/>
              <input class="s-input" placeholder="До" style="width: 50%; padding-left: 16px; padding-right: 12px;"/>
            </div>
          </div>
        </div>

        <div style="display: flex; gap: 8px; flex: 1.1; align-items: center; height: 48px;">
          <button class="s-btn" onclick="const p = document.getElementById('extended-filters-panel'); p.style.display = p.style.display === 'none' ? 'grid' : 'none';" style="flex: 1; height: 100%; background: var(--cream); color: var(--ink); border: 1.5px solid var(--border); box-shadow: none; justify-content: center;">Все фильтры</button>
          <button class="s-btn" onclick="navigateWithFilters()" style="flex: 1; height: 100%; justify-content: center;">Найти</button>
        </div>
      </div>

      <!-- EXTENDED FILTERS PANEL -->
      <div id="extended-filters-panel" style="display: none; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; padding-top: 24px; border-top: 1px solid var(--border);">
        <!-- Город -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Город</label>
          <select class="s-select" style="width: 100%; height: 48px; padding-left: 16px;">
            <option>Душанбе</option>
          </select>
        </div>
        <!-- Стадия строительства -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Стадия строительства</label>
          <select class="s-select" style="width: 100%; height: 48px; padding-left: 16px;">
            <option>Любая</option>
            <option>Построен</option>
            <option>Строится</option>
            <option>Котлован</option>
          </select>
        </div>
        <!-- Район -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Район</label>
          <select class="s-select" style="width: 100%; height: 48px; padding-left: 16px;">
            <option>Все районы</option>
            <option>Исмоили Сомони</option>
            <option>Сино</option>
            <option>Фирдавси</option>
            <option>Шохмансур</option>
          </select>
        </div>
        <!-- Ремонт -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Ремонт</label>
          <select class="s-select" style="width: 100%; height: 48px; padding-left: 16px;">
            <option>Выберите типы ремонта</option>
            <option>С ремонтом</option>
            <option>Без ремонта (коробка)</option>
            <option>Евроремонт</option>
            <option>Дизайнерский</option>
          </select>
        </div>
        <!-- Площадь от/до -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Площадь от</label>
          <input class="s-input" placeholder="0 м²" style="width: 100%; height: 48px; padding-left: 16px;"/>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Площадь до</label>
          <input class="s-input" placeholder="0 м²" style="width: 100%; height: 48px; padding-left: 16px;"/>
        </div>
        <!-- Этаж от/до -->
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Этаж от</label>
          <input class="s-input" placeholder="0" style="width: 100%; height: 48px; padding-left: 16px;"/>
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Этаж до</label>
          <input class="s-input" placeholder="0" style="width: 100%; height: 48px; padding-left: 16px;"/>
        </div>
        <!-- Ориентир -->
        <div style="display: flex; flex-direction: column; gap: 8px; grid-column: span 2;">
          <label style="font-size: 13px; font-weight: 600; color: var(--ink);">Ориентир</label>
          <input class="s-input" placeholder="Например: Парк Рудаки" style="width: 100%; height: 48px; padding-left: 16px;"/>
        </div>
      </div>
    </div>
  </section>

  <!-- FEATURED LISTINGS -->
  <section class="listings-section reveal">
    <div class="container">
      <div class="section-header">
        <div class="section-eyebrow">Свежие предложения</div>
        <h2 class="section-title">Популярные <strong>объявления</strong></h2>
        <p class="section-sub">Лучшие варианты квартир в Душанбе по соотношению цены и качества</p>
      </div>

      <div class="grid-3" id="featured-grid">
        <!-- Cards injected by JS -->
      </div>
      <div style="text-align:center;margin-top:40px">
        <button class="btn-secondary" onclick="navigate('listings')" style="margin:0 auto">
          Смотреть все объявления
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12l7-7M12 12V5H5"/></svg>
        </button>
      </div>
    </div>
  </section>

  <!-- SERVICES -->
  <section class="services-section reveal">
    <div class="container">
      <div class="section-header" style="margin-bottom:40px">
        <div class="section-eyebrow" style="color:rgba(245,200,66,.8)">Для вас</div>
        <h2 class="section-title" style="color:white">Наши <strong>услуги</strong></h2>
        <p class="section-sub" style="color:rgba(255,255,255,.55)">Полный спектр услуг в сфере недвижимости</p>
      </div>
      <style>
        .service-card button, .service-card a { display: none !important; }
        .test-gold-btn {
          padding: 8px 20px; font-size: 13px; font-weight: 600; border-radius: 100px; width: fit-content; 
          background: var(--gold-pale); color: var(--gold-dark); border: 1.5px solid var(--gold); 
          cursor: pointer; transition: all 0.2s; display: inline-block; text-align: center;
        }
        .test-gold-btn:hover { background: var(--gold); color: var(--ink); }
      </style>
      <div class="services-grid">
        <div class="service-card" style="position: relative; overflow: hidden; display: flex; flex-direction: column;" onclick="window.location.href='/buy-property'">
          <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; opacity: 0.15; z-index: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.3'" onmouseout="this.style.opacity='0.15'"></div>
          <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;">
            <div class="service-icon">[[ICON_HOME]]</div>
            <h3>Срочный выкуп</h3>
            <p style="flex: 1;">Быстрая оценка объекта и сопровождение продажи без лишних ожиданий</p>
            <div class="service-price" style="margin-bottom: 16px;">По оценке объекта</div>
            <div class="test-gold-btn" onclick="event.stopPropagation(); window.location.href='/buy-property'">Подробнее</div>
          </div>
        </div>
        <div class="service-card" style="position: relative; overflow: hidden; display: flex; flex-direction: column;" onclick="window.location.href='/repair'">
          <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; opacity: 0.15; z-index: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.3'" onmouseout="this.style.opacity='0.15'"></div>
          <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;">
            <div class="service-icon">[[ICON_CONSTRUCTION]]</div>
            <h3>Ремонт под ключ</h3>
            <p style="flex: 1;">Смета, подрядчики, контроль этапов и подготовка объекта к заселению</p>
            <div class="service-price" style="margin-bottom: 16px;">По запросу</div>
            <div class="test-gold-btn" onclick="event.stopPropagation(); window.location.href='/repair'">Подробнее</div>
          </div>
        </div>
        <div class="service-card" style="position: relative; overflow: hidden; display: flex; flex-direction: column;" onclick="window.location.href='/design'">
          <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; opacity: 0.15; z-index: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.3'" onmouseout="this.style.opacity='0.15'"></div>
          <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;">
            <div class="service-icon">[[ICON_CAMERA]]</div>
            <h3>Дизайнерские услуги</h3>
            <p style="flex: 1;">Планировка, подбор материалов и визуальная концепция интерьера</p>
            <div class="service-price" style="margin-bottom: 16px;">По запросу</div>
            <div class="test-gold-btn" onclick="event.stopPropagation(); window.location.href='/design'">Подробнее</div>
          </div>
        </div>
        <div class="service-card" style="position: relative; overflow: hidden; display: flex; flex-direction: column;" onclick="window.location.href='/document-registration'">
          <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; opacity: 0.15; z-index: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.3'" onmouseout="this.style.opacity='0.15'"></div>
          <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;">
            <div class="service-icon">[[ICON_CLIPBOARD]]</div>
            <h3>Оформление документов</h3>
            <p style="flex: 1;">Подготовка и проверка документов для сделки с недвижимостью</p>
            <div class="service-price" style="margin-bottom: 16px;">По запросу</div>
            <div class="test-gold-btn" onclick="event.stopPropagation(); window.location.href='/document-registration'">Подробнее</div>
          </div>
        </div>
        <div class="service-card" style="position: relative; overflow: hidden; display: flex; flex-direction: column;" onclick="window.location.href='/putty'">
          <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; opacity: 0.15; z-index: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.3'" onmouseout="this.style.opacity='0.15'"></div>
          <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;">
            <div class="service-icon">[[ICON_SPARKLES]]</div>
            <h3>Шпаклевка в подарок</h3>
            <p style="flex: 1;">При покупке жилья — шпаклевка стен в подарок!</p>
            <div class="service-price" style="margin-bottom: 16px;">Бесплатно</div>
            <div class="test-gold-btn" onclick="event.stopPropagation(); window.location.href='/putty'">Подробнее</div>
          </div>
        </div>
        <div class="service-card" style="position: relative; overflow: hidden; display: flex; flex-direction: column;" onclick="window.location.href='/cleaning'">
          <div style="position: absolute; inset: 0; background-image: url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80'); background-size: cover; background-position: center; opacity: 0.15; z-index: 0; transition: opacity 0.3s;" onmouseover="this.style.opacity='0.3'" onmouseout="this.style.opacity='0.15'"></div>
          <div style="position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column;">
            <div class="service-icon">[[ICON_STAR]]</div>
            <h3>Клининг</h3>
            <p style="flex: 1;">Уборка перед показом, после ремонта или перед заселением</p>
            <div class="service-price" style="margin-bottom: 16px;">По объему работ</div>
            <div class="test-gold-btn" onclick="event.stopPropagation(); window.location.href='/cleaning'">Подробнее</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- REVIEWS -->
  <section class="reviews-section reveal" style="padding: 80px 0; background: var(--bg-color);">
    <div class="container">
      <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="section-eyebrow">Мнения клиентов</div>
          <h2 class="section-title">Отзывы о <strong>Barakat Estate</strong></h2>
        </div>
        <button class="btn-primary" onclick="openReviewModal()" style="padding:12px 24px;border-radius:100px;border:none;background:var(--gold);color:var(--ink);font-weight:600;cursor:pointer;">Оставить отзыв</button>
      </div>
      <div class="reviews-grid" id="reviews-grid" style="display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:24px;padding-bottom:20px;padding-top:10px;align-items:flex-start;">
        <div style="width: 100%; padding: 40px 20px; text-align: center;">
          <div class="spinner" style="margin: 0 auto 20px auto; width: 40px; height: 40px; border: 3px solid rgba(212,175,55,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="color: var(--muted);">Загрузка отзывов...</p>
        </div>
      </div>
    </div>
  </section>

  <!-- MAP PREVIEW -->
  <section class="map-preview-section reveal">
    <div class="container">
      <div class="section-header">
        <div class="section-eyebrow">Карта</div>
        <h2 class="section-title">Найди квартиру <strong>на карте</strong></h2>
        <p class="section-sub">Просматривай объекты в интерактивной карте Душанбе</p>
      </div>
      <div class="map-container" onclick="navigate('map')">
        <div class="map-placeholder">
          <div id="preview-yandex-map" class="yandex-map" style="width: 100%; height: 100%;"></div>
        </div>
        <div class="map-overlay-ui">
          <h4>Душанбе</h4>
          <p class="map-home-results-count">Объекты на карте</p>
        </div>
        <div class="map-cta-overlay">[[ICON_MAP]] Открыть карту</div>
      </div>
    </div>
  </section>

  <!-- FOOTER -->
  <footer>
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo"><div class="dot"></div>Barakat Estate</div>
          <p>Платформа по поиску недвижимости в Душанбе. Помогаем найти дом вашей мечты.</p>
          <div class="footer-social">
            <a class="soc-btn" href="#">[[ICON_SMARTPHONE]]</a>
            <a class="soc-btn" href="#">[[ICON_MESSAGE]]</a>
            <a class="soc-btn" href="#">[[ICON_CAMERA]]</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Каталог</h4>
          <a onclick="navigate('listings')">Квартиры</a>
          <a onclick="navigate('listings')">Дома</a>
          <a onclick="navigate('listings')">Студии</a>
          <a onclick="navigate('listings')">Коммерческая</a>
        </div>
        <div class="footer-col">
          <h4>Услуги</h4>
          <a onclick="navigate('services')">Аренда</a>
          <a onclick="navigate('services')">Покупка</a>
          <a onclick="navigate('services')">Оценка</a>
          <a onclick="navigate('services')">Юридическое</a>
        </div>
        <div class="footer-col">
          <h4>Контакты</h4>
          <a href="#">Душанбе, ул. Рудаки 45</a>
          <a href="tel:+992000000000">+992 000 00 00</a>
          <a href="#">info@barakat.tj</a>
          
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Barakat Estate. Все права защищены.</p>
        <span>Душанбе, Таджикистан</span>
      </div>
    </div>
  </footer>
</div>`,
  listings: `<div class="page active" id="page-listings">
  <div class="listings-page">
    <div class="listings-hero" style="background-image: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('/ob.jpg'); background-size: cover; background-position: center 40%; color: white; transform: scaleX(-1); padding-top: 130px; padding-bottom: 90px;">
      <div class="container" style="transform: scaleX(-1);">
        <h1 style="color: white;">Все <strong>объявления</strong></h1>
        <p class="listings-total-hero" style="color: rgba(255,255,255,0.85);">Найдено <span class="total-num"></span> объекта в Душанбе</p>
      </div>
    </div>

    <!-- SEARCH BAR IN LISTINGS -->
    <div style="background:white;padding:16px var(--site-pad);border-bottom:1px solid var(--border)">
      <div class="search-row" style="max-width:1280px;margin:0 auto;">
        <div class="s-input-wrap" style="flex:1">
          <svg width="18" height="18" fill="none" stroke="#8A7F6A" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="m14 14-3-3"/></svg>
          <input class="s-input" placeholder="Поиск по адресу..."/>
        </div>
        <select class="s-select"><option>Все типы</option><option>Квартира</option><option>Вторичка</option><option>Новостройки</option><option>Котлован</option><option>Дома</option><option>Дом</option><option>Земельные участки</option><option>Коммерческая</option><option>Дача</option><option>Парковка</option><option>Комната</option></select>
        <select class="s-select"><option>Комнат</option><option>1</option><option>2</option><option>3</option><option>4+</option></select>
        <button class="s-btn">Найти</button>
      </div>
    </div>

    <div class="listings-layout">
      <!-- SIDEBAR -->
      <div class="listings-filter-sidebar">
        <h3 style="font-size:16px;font-weight:700;margin-bottom:24px">Фильтры</h3>

        <div class="filter-group">
          <h4>Тип сделки</h4>
          <label class="filter-check"><input type="checkbox" checked /><label>Продажа</label></label>
          <label class="filter-check"><input type="checkbox" checked /><label>Аренда</label></label>
        </div>

        <div class="filter-group">
          <h4>Тип недвижимости</h4>
          <label class="filter-check"><input type="checkbox" /><label>Квартира</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Вторичка</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Новостройки</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Котлован</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Дома</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Дом</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Земельные участки</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Коммерческая</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Дача</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Парковка</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Комната</label></label>
        </div>

        <div class="filter-group">
          <h4>Комнат</h4>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="filter-chip" style="padding:6px 12px;font-size:12px">1</button>
            <button class="filter-chip active" style="padding:6px 12px;font-size:12px">2</button>
            <button class="filter-chip" style="padding:6px 12px;font-size:12px">3</button>
            <button class="filter-chip" style="padding:6px 12px;font-size:12px">4+</button>
          </div>
        </div>

        <div class="filter-group">
          <h4>Цена (TJS)</h4>
          <div class="filter-range-inputs">
            <input type="number" placeholder="От" min="0" step="10000" />
            <span class="filter-range-sep">—</span>
            <input type="number" placeholder="До" min="0" step="10000" />
          </div>
        </div>

        <div class="filter-group">
          <h4>Площадь (м²)</h4>
          <div class="filter-range-inputs">
            <input type="number" placeholder="От" min="0" step="1" />
            <span class="filter-range-sep">—</span>
            <input type="number" placeholder="До" min="0" step="1" />
          </div>
        </div>

        <div class="filter-group">
          <h4>Стадия строительства</h4>
          <label class="filter-check"><input type="checkbox" /><label>Построен</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Строится</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Котлован</label></label>
        </div>

        <div class="filter-group">
          <h4>Район</h4>
          <label class="filter-check"><input type="checkbox" /><label>Центр</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Исмоили Сомони</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Сино</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Фирдавси</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Шохмансур</label></label>
        </div>

        <div class="filter-group">
          <h4>Особенности</h4>
          <label class="filter-check"><input type="checkbox" /><label>Парковка</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Лифт</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Балкон</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Мебель</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Охрана</label></label>
        </div>

        <div class="filter-group">
          <h4>Документ</h4>
          <label class="filter-check"><input type="checkbox" /><label>Договор</label></label>
          <label class="filter-check"><input type="checkbox" /><label>Техпаспорт</label></label>
        </div>

        <button class="btn-primary" style="width:100%;justify-content:center">Применить</button>
      </div>

      <!-- MAIN LISTINGS -->
      <div class="listings-main">
        <div class="listings-topbar">
          <div class="listings-count">Найдено: <strong><span class="total-num"></span> объектов</strong></div>
          <div style="display:flex;gap:10px;align-items:center">
            <select class="sort-select">
              <option>По умолчанию</option>
              <option>Сначала дешевле</option>
              <option>Сначала дороже</option>
              <option>Новые первые</option>
            </select>
            <button onclick="navigate('map')" style="background:var(--gold);border:none;border-radius:100px;padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;">
              [[ICON_MAP]] Карта
            </button>
          </div>
        </div>
        <div class="grid-3" id="listings-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))">
          <!-- injected -->
        </div>
        <div style="text-align:center;margin-top:36px">
          <button class="btn-secondary" onclick="showNotif('Загружаем ещё объявления...')">Загрузить ещё</button>
        </div>
      </div>
    </div>
  </div>
</div>`,
  favorites: `<div class="page active" id="page-favorites">
  <div class="listings-page">
    <div class="listings-hero" style="background-image: linear-gradient(135deg, rgba(30, 45, 74, 0.8) 0%, rgba(212, 175, 55, 0.5) 100%), url('/pink.png'); background-size: cover; background-position: center 30%; color: white; padding-top: 100px; padding-bottom: 70px; text-align: center; position: relative;">
      <div class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; z-index: 2;">
        <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3); color: white;">
          <svg width="32" height="32" fill="rgba(255,255,255,0.9)" viewBox="0 0 24 24" stroke="rgba(255,255,255,1)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </div>
        <h1 style="color: white; font-size: 48px; font-weight: 800; letter-spacing: -1.5px; margin-bottom: 12px; text-shadow: 0 4px 16px rgba(0,0,0,0.4); line-height: 1.1;">Ваше Избранное</h1>
        <p id="favorites-count" style="color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500; max-width: 600px; margin: 0 auto; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">Здесь бережно хранятся лучшие объекты недвижимости, которые вам понравились</p>
      </div>
    </div>
    <div class="listings-section" style="padding:40px">
      <div class="container">
        <div class="grid-3" id="favorites-grid" style="grid-template-columns:repeat(auto-fill,minmax(280px,1fr))"></div>
      </div>
    </div>
  </div>
</div>`,
  services: `<div class="page active" id="page-services">
  <div class="services-page-shell">
    <section class="services-hero-panel" style="background-image: linear-gradient(135deg, rgba(30, 45, 74, 0.85) 0%, rgba(212, 175, 55, 0.6) 100%), url('/Lol.png'); background-size: cover; background-position: center center; color: white; position: relative; min-height: 50vh; display: flex; align-items: center; justify-content: center; padding-top: 80px;">
      <div class="container" style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;">
        <div class="section-eyebrow" style="color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);">Сервисы</div>
        <h1 class="section-title" style="color: white; text-shadow: 0 4px 16px rgba(0,0,0,0.4);">Услуги <strong>Barakat Estate</strong></h1>
        <p class="section-sub" style="color: rgba(255,255,255,0.9); text-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 16px;">Шесть сервисов для покупки, подготовки и оформления недвижимости в Душанбе.</p>
      </div>
    </section>

    <section class="services-section services-catalog-section">
      <div class="container">
        <div class="services-grid services-grid-featured">
          <article class="service-card service-card-action service-theme-repair" style="cursor: pointer;" onclick="window.location.href='/putty'">
            <div class="service-card-media"><img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80" alt="Шпаклевка совершенно бесплатно!" loading="lazy" /></div>
            <div class="service-card-body">
              <div class="service-icon">[[ICON_SPARKLES]]</div>
              <h3>Шпаклевка в подарок</h3>
              <p>При покупке жилья через ЧДММ «Баракат Хизматрасон» — шпаклевка в подарок!</p>
              <div class="service-price">Бесплатно</div>
              <a class="service-request-btn" href="/putty" onclick="event.stopPropagation()">Подробнее</a>
            </div>
          </article>
          <article class="service-card service-card-action service-theme-buyout" style="cursor: pointer;" onclick="window.location.href='/buy-property'">
            <div class="service-card-media"><img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" alt="Срочный выкуп" loading="lazy" /></div>
            <div class="service-card-body">
              <div class="service-icon">[[ICON_MONEY]]</div>
              <h3>Срочный выкуп</h3>
              <p>Оценка объекта, проверка документов и быстрый выход на сделку.</p>
              <div class="service-price">По оценке объекта</div>
              <a class="service-request-btn" href="/buy-property" onclick="event.stopPropagation()">Подробнее</a>
            </div>
          </article>
          <article class="service-card service-card-action service-theme-repair" style="cursor: pointer;" onclick="window.location.href='/repair'">
            <div class="service-card-media"><img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" alt="Ремонт под ключ" loading="lazy" /></div>
            <div class="service-card-body">
              <div class="service-icon">[[ICON_CONSTRUCTION]]</div>
              <h3>Ремонт под ключ</h3>
              <p>Смета, материалы, подрядчики и контроль результата.</p>
              <div class="service-price">По запросу</div>
              <a class="service-request-btn" href="/repair" onclick="event.stopPropagation()">Подробнее</a>
            </div>
          </article>
          <article class="service-card service-card-action service-theme-design" style="cursor: pointer;" onclick="window.location.href='/design'">
            <div class="service-card-media"><img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" alt="Дизайн интерьера" loading="lazy" /></div>
            <div class="service-card-body">
              <div class="service-icon">[[ICON_HOME]]</div>
              <h3>Дизайн интерьера</h3>
              <p>Планировка, визуализация и стильная упаковка объекта.</p>
              <div class="service-price">По запросу</div>
              <a class="service-request-btn" href="/design" onclick="event.stopPropagation()">Подробнее</a>
            </div>
          </article>
          <article class="service-card service-card-action service-theme-cleaning" style="cursor: pointer;" onclick="window.location.href='/cleaning'">
            <div class="service-card-media"><img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80" alt="Клининг" loading="lazy" /></div>
            <div class="service-card-body">
              <div class="service-icon">[[ICON_SPARKLES]]</div>
              <h3>Клининг</h3>
              <p>Уборка перед показом, после ремонта или перед заселением.</p>
              <div class="service-price">По объему работ</div>
              <a class="service-request-btn" href="/cleaning" onclick="event.stopPropagation()">Подробнее</a>
            </div>
          </article>
          <article class="service-card service-card-action service-theme-documents" style="cursor: pointer;" onclick="window.location.href='/document-registration'">
            <div class="service-card-media"><img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80" alt="Оформление документов" loading="lazy" /></div>
            <div class="service-card-body">
              <div class="service-icon">[[ICON_CLIPBOARD]]</div>
              <h3>Документы</h3>
              <p>Проверка, консультация и сопровождение оформления сделки.</p>
              <div class="service-price">По запросу</div>
              <a class="service-request-btn" href="/document-registration" onclick="event.stopPropagation()">Подробнее</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</div>`,
  putty: `<div class="page active" id="page-putty">
  <div class="services-page-shell">
    <section class="services-hero-panel" style="background-image: linear-gradient(135deg, rgba(30, 45, 74, 0.85) 0%, rgba(212, 175, 55, 0.6) 100%), url('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center center; color: white; position: relative; min-height: 40vh; display: flex; align-items: center; justify-content: center; padding-top: 80px;">
      <div class="container" style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center;">
        <div class="section-eyebrow" style="color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);">Специальная акция</div>
        <h1 class="section-title" style="color: white; text-shadow: 0 4px 16px rgba(0,0,0,0.4);">Шпаклевка в <strong>подарок!</strong></h1>
      </div>
    </section>

    <section style="padding: 80px 0; background: #fff;">
      <div class="container" style="max-width: 800px; margin: 0 auto;">
        <h2 style="font-size: 32px; font-weight: 300; margin-bottom: 24px; color: var(--ink);">Доверьте покупку нам — получите больше выгоды!</h2>
        <p style="font-size: 18px; line-height: 1.8; color: var(--muted); margin-bottom: 24px;">
          Barakat Estate совместно с ЧДММ «Баракат Хизматрасон» объявляет о запуске эксклюзивной акции для наших клиентов.
          При покупке любого жилья через наше агентство недвижимости, мы берем на себя черновые отделочные работы, а именно — шпаклевку всех стен вашего нового дома, <strong>совершенно бесплатно!</strong>
        </p>
        
        <div style="background: var(--cream); border-left: 4px solid var(--gold); padding: 24px; border-radius: 0 16px 16px 0; margin-bottom: 40px;">
          <h3 style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: var(--ink);">Что вы получаете:</h3>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 12px; color: var(--ink);">
            <li style="display: flex; align-items: flex-start; gap: 12px;"><div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div> <span><strong>Безопасные стройматериалы:</strong> Мы используем только проверенные и экологически чистые смеси.</span></li>
            <li style="display: flex; align-items: flex-start; gap: 12px;"><div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div> <span><strong>Проверено качеством:</strong> Работу выполняют мастера с многолетним опытом.</span></li>
            <li style="display: flex; align-items: flex-start; gap: 12px;"><div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div> <span><strong>Идеально ровная поверхность:</strong> Стены будут полностью готовы к финальной отделке (поклейке обоев или покраске).</span></li>
          </ul>
        </div>

        <style>
          .beautiful-input { background: rgba(255, 255, 255, 0.6); border: 1px solid var(--gold); transition: all 0.3s ease; text-align: left; backdrop-filter: blur(4px); }
          .beautiful-input:focus { background: white; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2); outline: none; }
          .minimal-btn { transition: all 0.3s ease; }
          .minimal-btn:hover { transform: translateY(-2px); filter: brightness(0.95); box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3); }
          .minimal-btn:active { transform: translateY(0); }
          @media (max-width: 768px) {
            .service-request-form {
              grid-template-columns: 1fr !important;
              padding: 32px 24px !important;
              gap: 16px !important;
            }
          }
        </style>
        <div style="background: var(--ink); padding: 80px 40px; border-radius: 24px; display: flex; flex-direction: column; align-items: center; width: 100%;">
          <div style="text-align: center; max-width: 600px; margin: 0 auto 40px auto; display: flex; flex-direction: column; align-items: center;">
            <h3 style="font-size: 32px; font-weight: 400; margin-bottom: 12px; color: white; text-align: center;">Оставить заявку</h3>
            <p style="font-size: 16px; color: rgba(255,255,255,0.6); font-weight: 300; text-align: center; margin: 0;">Оставьте заявку, чтобы узнать все подробности акции и начать подбор вашей идеальной квартиры.</p>
          </div>
          
          <div style="width: 100%; max-width: 600px;">
            <div class="service-request-success" style="display: none; background: linear-gradient(145deg, #ffffff 0%, #f0f4f8 100%); border: 1px solid var(--gold); border-radius: 20px; padding: 48px 32px; text-align: center; color: var(--ink); box-shadow: 0 20px 50px rgba(0,0,0,0.3); animation: fadeUp 0.6s ease-out forwards;">
              <div style="display: inline-flex; align-items: center; justify-content: center; width: 88px; height: 88px; border-radius: 50%; background: rgba(34, 197, 94, 0.1); margin-bottom: 24px;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); color: white; box-shadow: 0 10px 25px rgba(22, 163, 74, 0.4);">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"></path></svg>
                </div>
              </div>
              <h3 style="font-size: 22px; font-weight: 500; margin-bottom: 8px;">Спасибо за заявку</h3>
              <p style="font-size: 16px; color: var(--muted);">Мы ответим вам как можно быстрее.</p>
            </div>
            
            <form class="service-request-form" data-service="Шпаклевка в подарок" style="background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%); border: 1px solid var(--gold); border-radius: 20px; padding: 48px; color: var(--ink); display: grid; grid-template-columns: 1fr 1fr; gap: 24px; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
              <label style="display: block;">
                <span style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: var(--ink);">Ваше имя</span>
                <input type="text" name="name" class="beautiful-input" required placeholder="Введите имя" style="width: 100%; padding: 16px 20px; border-radius: 12px; color: var(--ink); font-size: 15px;" />
              </label>
              <label style="display: block;">
                <span style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: var(--ink);">Ваш телефон</span>
                <input type="tel" name="phone" class="phone-input beautiful-input" required placeholder="+992 000 00 0000" style="width: 100%; padding: 16px 20px; border-radius: 12px; color: var(--ink); font-size: 15px;" />
              </label>
              <label style="display: block; grid-column: 1 / -1;">
                <span style="display: block; margin-bottom: 8px; font-weight: 500; font-size: 14px; color: var(--ink);">Комментарий</span>
                <textarea name="message" class="beautiful-input" required placeholder="Детали заявки..." style="width: 100%; padding: 16px 20px; border-radius: 12px; color: var(--ink); font-size: 15px; min-height: 120px; resize: none;"></textarea>
              </label>
              <div style="text-align: center; grid-column: 1 / -1; margin-top: 8px;">
                <button type="submit" class="minimal-btn" style="padding: 18px 48px; border: none; border-radius: 12px; background: var(--gold); color: var(--ink); font-weight: 600; cursor: pointer; font-size: 16px; width: 100%;">Отправить заявку</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</div>`,
  map: `<div class="page active" id="page-map">
  <div class="map-page">
    <!-- TOP BAR -->
    <div class="map-topbar">
      <div class="s-input-wrap" style="max-width:320px">
        <svg width="18" height="18" fill="none" stroke="#8A7F6A" stroke-width="2"><circle cx="8" cy="8" r="6"/><path d="m14 14-3-3"/></svg>
        <input class="s-input" style="background:var(--cream)" placeholder="Поиск по карте..."/>
      </div>
      <div class="filters-row" style="margin:0">
        <button class="filter-chip active">Все</button>
        <button class="filter-chip">Продажа</button>
        <button class="filter-chip">Аренда</button>
        <button class="filter-chip">1 комн</button>
        <button class="filter-chip">2 комн</button>
        <button class="filter-chip">3+ комн</button>
      </div>
    </div>

    <!-- MAP + SIDEBAR -->
    <div class="map-full">
      <div id="yandex-full-map" class="yandex-map" style="width: 100%; height: 100%;"></div>
      <!-- Map background -->
      <div style="position:absolute;inset:0;z-index:-1;background:linear-gradient(160deg,#1e2d4a 0%,#16213e 40%,#0f172a 100%)">
        <!-- Street lines -->
        <div class="map-line h" style="top:18%;opacity:.15"></div>
        <div class="map-line h" style="top:32%;opacity:.1"></div>
        <div class="map-line h" style="top:50%;opacity:.2;height:2px"></div>
        <div class="map-line h" style="top:65%;opacity:.1"></div>
        <div class="map-line h" style="top:80%;opacity:.12"></div>
        <div class="map-line v" style="left:20%;opacity:.15"></div>
        <div class="map-line v" style="left:38%;opacity:.2;width:2px"></div>
        <div class="map-line v" style="left:55%;opacity:.1"></div>
        <div class="map-line v" style="left:70%;opacity:.12"></div>
        <!-- District labels -->
        <div style="position:absolute;top:20%;left:10%;color:rgba(255,255,255,.2);font-size:11px;letter-spacing:2px;text-transform:uppercase">Шохмансур</div>
        <div style="position:absolute;top:40%;left:28%;color:rgba(255,255,255,.25);font-size:12px;letter-spacing:2px;text-transform:uppercase">Центр</div>
        <div style="position:absolute;top:55%;left:55%;color:rgba(255,255,255,.2);font-size:11px;letter-spacing:2px;text-transform:uppercase">И. Сомони</div>
        <div style="position:absolute;top:22%;left:60%;color:rgba(255,255,255,.2);font-size:11px;letter-spacing:2px;text-transform:uppercase">Сино</div>
      </div>

      <!-- SIDEBAR -->
      <div class="map-sidebar">
        <div class="map-sidebar-header">
          <h3>Объекты на карте</h3>
          <p id="map-results-count">Показано: 142 объекта</p>
        </div>
        <div class="map-results" id="map-results-list">
          <!-- injected -->
        </div>
      </div>
    </div>
  </div>
</div>`,
  property: `<div class="page active" id="page-property">
  <div class="prop-detail">
    <!-- Breadcrumb -->
    <div style="max-width:1280px;margin:0 auto;padding:16px 40px 0;display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)">
      <span onclick="navigate('home')" style="cursor:pointer;transition:color .2s" onmouseover="this.style.color='var(--gold-dark)'" onmouseout="this.style.color='var(--muted)'">Главная</span>
      <span>/</span>
      <span onclick="navigate('listings')" style="cursor:pointer;transition:color .2s" onmouseover="this.style.color='var(--gold-dark)'" onmouseout="this.style.color='var(--muted)'">Объявления</span>
      <span>/</span>
      <span style="color:var(--ink)">3-комн. квартира в Центре</span>
    </div>

    <!-- GALLERY -->
    <div class="detail-gallery-wrapper">
      <button class="gallery-arrow prev" onclick="document.querySelector('.detail-gallery').scrollBy({left: -300, behavior: 'smooth'})">‹</button>
      <div class="detail-gallery">
        <div class="gallery-main"></div>
        <div class="gallery-thumbs"></div>
      </div>
      <button class="gallery-arrow next" onclick="document.querySelector('.detail-gallery').scrollBy({left: 300, behavior: 'smooth'})">›</button>
    </div>

    <!-- DETAIL BODY -->
    <div class="detail-body">
      <div class="detail-left">
        <div class="detail-price-row">
          <div class="detail-price">900 000 смн</div>
          <div class="detail-price-per">≈ 10 300 смн/м²</div>
        </div>
        <div class="detail-title">3-комнатная квартира в центре Душанбе</div>
        <div class="detail-addr">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
          ул. Садриддина Айни, 14, кв. 37, Центр, Душанбе
        </div>

        <div class="detail-chips">
          <!-- injected by js -->
        </div>

        <div class="detail-section-title">Описание</div>
        <p class="detail-desc">
          Просторная и светлая 3-комнатная квартира в новом ЖК в центре Душанбе. Высота потолков — 3 м, панорамные окна с видом на горы. Отличный ремонт под ключ, встроенная кухня. Тихий двор, видеонаблюдение. В шаговой доступности — рынок Баракат, школы, детские сады.
          <br/><br/>
          Квартира полностью готова к заселению. Продаётся без обременений, все документы в порядке. Возможен торг.
        </p>

        <div class="detail-section-title">Удобства</div>
        <div class="amenities-grid">
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Кондиционер
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Интернет
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Лифт
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Паркинг
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Охрана 24/7
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Балкон
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Мебель
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Видеодомофон
          </div>
          <div class="amenity">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            Тёплый пол
          </div>
        </div>

        <!-- Mini-map on detail page -->
        <div class="detail-section-title">На карте</div>
        <div style="height:200px;border-radius:14px;overflow:hidden;position:relative;cursor:pointer" onclick="navigate('map')">
          <div id="detail-yandex-map" class="yandex-map" style="width: 100%; height: 100%;"></div>
          <div id="detail-map-coords" class="detail-map-coords">38.5460, 68.7635</div>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
            <div class="map-dot lg" style="position:relative;animation:pulse 2s ease-in-out infinite"></div>
          </div>
          <div style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.95);border-radius:100px;padding:6px 16px;font-size:12px;font-weight:600;white-space:nowrap">
            [[ICON_MAP_PIN]] ул. Айни, 14 — Смотреть на карте
          </div>
        </div>
      </div>

      <!-- RIGHT: CONTACT CARD -->
      <div>
        <div class="contact-card">
          <div class="price-display">900 000 смн</div>
          <div class="price-note">Продажа · 87 м² · 3-комн</div>

          <!-- Agent -->
          <div class="contact-agent" onclick="navigate('agent')">
            <div class="ca-ava">АА</div>
            <div class="ca-info">
              <strong>Алиджон Ахмедов</strong>
              <small>47 сделок</small>
            </div>
            <svg style="margin-left:auto;opacity:.3" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>

          <div class="contact-actions" style="display: flex; flex-direction: column; gap: 12px; margin-top: 24px;">
            <div style="background: var(--cream); border-radius: 12px; padding: 16px; text-align: center; border: 1px solid var(--border);">
              <div style="font-size: 13px; color: var(--muted); margin-bottom: 4px;">Телефон продавца</div>
              <a href="tel:+992000000000" id="contact-phone-display" style="font-size: 22px; font-weight: 700; color: var(--ink); letter-spacing: 0.5px; text-decoration: none; display: block;">+992 000 00 00 00</a>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <a href="#" id="contact-whatsapp" class="contact-btn" style="background: #25D366; color: white; border: none; font-weight: 600; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 12px;" onclick="showNotif('Открываем WhatsApp...')">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.055h-.006c-1.637 0-3.238-.42-4.661-1.218l-.335-.19-3.468.91 1.053-3.375-.208-.344C3.606 15.541 3.176 13.824 3.176 12.052c0-4.887 3.982-8.868 8.874-8.868 2.372 0 4.598.924 6.273 2.602a8.814 8.814 0 012.593 6.269c-.001 4.888-3.983 8.87-8.874 8.871zm-5.46-3.239c1.385.819 2.96 1.25 4.582 1.25h.005c3.963 0 7.189-3.226 7.19-7.189a7.126 7.126 0 00-2.1-5.068 7.13 7.13 0 00-5.074-2.103c-3.963 0-7.189 3.225-7.189 7.188 0 1.63.456 3.228 1.32 4.64l.115.187-.626 2.006 2.05-.538.169.1zM16.14 14.195c-.225-.113-1.332-.657-1.537-.732-.206-.075-.356-.113-.507.113-.15.226-.581.733-.713.884-.131.15-.262.17-.488.056-.225-.113-.948-.349-1.805-1.114-.666-.595-1.116-1.33-1.248-1.555-.13-.226-.014-.348.099-.461.101-.102.225-.263.338-.395.112-.131.15-.225.224-.375.076-.151.038-.282-.019-.395-.056-.113-.506-1.22-.693-1.67-.182-.44-.366-.38-.507-.387l-.432-.008c-.15 0-.393.056-.6.282-.206.225-.787.77-.787 1.876s.806 2.177.918 2.327c.113.15 1.588 2.424 3.844 3.398 1.892.818 2.502.656 2.99.544.526-.122 1.332-.544 1.52-1.07.186-.525.186-.975.131-1.07-.056-.093-.207-.15-.432-.262z"/></svg>
                WhatsApp
              </a>
              <a href="#" id="contact-telegram" class="contact-btn" style="background: #0088cc; color: white; border: none; font-weight: 600; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; padding: 12px;" onclick="showNotif('Открываем Telegram...')">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
                Telegram
              </a>
            </div>
          </div>

          <div class="safety-note">[[ICON_SHIELD]] Безопасная сделка · Проверенный продавец</div>
        </div>
      </div>
    </div>
  </div>
</div>`,
  agent: `<div class="page active" id="page-agent">
  <div class="agent-page">
    <div class="agent-hero">
      <div class="agent-hero-inner">
        <div class="agent-avatar">АА</div>
        <div class="agent-info">
          <h1>Алиджон Ахмедов</h1>
          <p>Риэлтор · Barakat Estate · Работает с 2019 года</p>
          <div class="agent-badges">
            <!-- Star removed -->
            <span class="agent-badge">47 сделок</span>
            <span class="agent-badge">[[ICON_CHECK]] Проверен</span>
            <span class="agent-badge">Центр · И. Сомони</span>
          </div>
        </div>
        <div style="margin-left:auto;display:flex;gap:10px;flex-shrink:0">
          <button class="contact-btn cb-primary" onclick="showNotif('Звоним продавцу...')" style="border-radius:100px;padding:12px 24px;background:var(--gold);color:var(--ink);border:none;font-weight:700;cursor:pointer">[[ICON_PHONE]] Позвонить</button>
          <button onclick="showNotif('Открываем мессенджер...')" style="border-radius:100px;padding:12px 24px;background:rgba(255,255,255,.1);color:white;border:1px solid rgba(255,255,255,.2);font-weight:600;cursor:pointer;font-size:15px">[[ICON_MESSAGE]] Написать</button>
        </div>
      </div>
    </div>

    <!-- Agent stats -->
    <div style="background:white;border-bottom:1px solid var(--border);padding:24px 40px">
      <div class="container" style="display:flex;gap:60px">
        <div class="stat-item">
          <div class="stat-num">47</div>
          <div class="stat-label">Успешных сделок</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">12<span>+</span></div>
          <div class="stat-label">Активных объявлений</div>
        </div>
        <div class="stat-item">
          <div class="stat-num"><span></span></div>
          <div class="stat-label">Средняя оценка</div>
        </div>
        <div class="stat-item">
          <div class="stat-num">6<span>лет</span></div>
          <div class="stat-label">Опыт работы</div>
        </div>
      </div>
    </div>

    <!-- Agent listings -->
    <div class="listings-section">
      <div class="container">
        <div class="section-header" style="text-align:left;margin-bottom:28px">
          <div class="section-eyebrow">Объявления</div>
          <h2 class="section-title">Объявления <strong>Алиджона</strong></h2>
        </div>
        <div class="grid-3" id="agent-grid">
          <!-- injected -->
        </div>
      </div>
    </div>
  </div>
</div>`,
  about: `<div class="page active" id="page-about">
  <div class="services-page-shell">
    <section class="services-hero-panel" style="background-image: linear-gradient(135deg, rgba(30, 45, 74, 0.85) 0%, rgba(212, 175, 55, 0.6) 100%), url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center center; color: white; position: relative; min-height: 50vh; display: flex; align-items: center; justify-content: center; padding-top: 80px;">
      <div class="container" style="position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center;">
        <div class="section-eyebrow" style="color: rgba(255,255,255,0.85); border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); backdrop-filter: blur(4px);">О компании</div>
        <h1 class="section-title" style="color: white; text-shadow: 0 4px 16px rgba(0,0,0,0.4);">Barakat <strong>Estate</strong></h1>
        <p class="section-sub" style="color: rgba(255,255,255,0.9); text-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 16px; max-width: 600px; text-align: center;">Ваш надежный партнер в сфере недвижимости</p>
      </div>
    </section>

    <section class="services-section about-us-section" style="padding: 80px 0; background: #fff;">
      <div class="container about-hero-grid">
        <div>
          <h2 style="font-size: 36px; font-weight: 300; margin-bottom: 24px; font-family: 'Montserrat', sans-serif; color: var(--ink);">Кто мы <strong>такие?</strong></h2>
          <p style="font-size: 16px; line-height: 1.8; color: var(--muted); margin-bottom: 20px;">
            <strong>Barakat Estate</strong> — современное агентство недвижимости в Душанбе, которое помогает клиентам выгодно покупать, продавать, сдавать в аренду и инвестировать в недвижимость.
          </p>
          <p style="font-size: 16px; line-height: 1.8; color: var(--muted); margin-bottom: 30px;">
            Мы работаем с новостройками, вторичным жильем, коммерческой недвижимостью и инвестиционными проектами. Наша цель — обеспечить клиентам безопасные сделки, профессиональное сопровождение и лучшие предложения на рынке.
          </p>
        </div>
        <div style="position: relative; padding-bottom: 20px;">
          <img src="/br.jpg" alt="Офис Barakat Estate" style="width: 100%; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
          <div class="about-float-card" style="position: absolute; bottom: 0px; left: -15px; background: white; padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 16px; max-width: 90%;">
            <div style="width: 50px; height: 50px; background: var(--gold-pale); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--gold-dark); flex-shrink: 0;">[[ICON_SHIELD]]</div>
            <div>
              <strong style="display: block; font-size: 18px; margin-bottom: 4px; color: var(--ink);">Надежность</strong>
              <span style="color: var(--muted); font-size: 14px;">Честность и результат</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="services-section" style="padding: 80px 0; background: var(--cream);">
      <div class="container">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 36px; font-weight: 300; font-family: 'Montserrat', sans-serif; color: var(--ink);">Наши <strong>услуги</strong></h2>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; gap: 16px;">
            <div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div>
            <span style="font-size: 16px; color: var(--ink); font-weight: 500;">Покупка и продажа недвижимости</span>
          </div>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; gap: 16px;">
            <div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div>
            <span style="font-size: 16px; color: var(--ink); font-weight: 500;">Аренда жилых и коммерческих объектов</span>
          </div>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; gap: 16px;">
            <div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div>
            <span style="font-size: 16px; color: var(--ink); font-weight: 500;">Подбор квартир в новостройках и котлованах</span>
          </div>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; gap: 16px;">
            <div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div>
            <span style="font-size: 16px; color: var(--ink); font-weight: 500;">Инвестиции в недвижимость</span>
          </div>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; gap: 16px;">
            <div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div>
            <span style="font-size: 16px; color: var(--ink); font-weight: 500;">Юридическое сопровождение сделок</span>
          </div>
          <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); display: flex; gap: 16px;">
            <div style="color: var(--gold); margin-top: 2px;">[[ICON_CHECK]]</div>
            <span style="font-size: 16px; color: var(--ink); font-weight: 500;">Консультации по рынку недвижимости</span>
          </div>
        </div>
      </div>
    </section>

    <section class="services-section" style="padding: 80px 0; background: #fff;">
      <div class="container">
        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="font-size: 36px; font-weight: 300; font-family: 'Montserrat', sans-serif; color: var(--ink);">Почему выбирают <strong>нас</strong></h2>
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
          <div style="padding: 20px 32px; border-radius: 100px; background: var(--cream); display: flex; align-items: center; gap: 12px; border: 1px solid var(--border);">
            <div style="color: var(--gold);">[[ICON_STAR]]</div>
            <span style="font-weight: 500; color: var(--ink);">Индивидуальный подход к каждому клиенту</span>
          </div>
          <div style="padding: 20px 32px; border-radius: 100px; background: var(--cream); display: flex; align-items: center; gap: 12px; border: 1px solid var(--border);">
            <div style="color: var(--gold);">[[ICON_STAR]]</div>
            <span style="font-weight: 500; color: var(--ink);">Проверенные объекты недвижимости</span>
          </div>
          <div style="padding: 20px 32px; border-radius: 100px; background: var(--cream); display: flex; align-items: center; gap: 12px; border: 1px solid var(--border);">
            <div style="color: var(--gold);">[[ICON_STAR]]</div>
            <span style="font-weight: 500; color: var(--ink);">Прозрачные условия сотрудничества</span>
          </div>
          <div style="padding: 20px 32px; border-radius: 100px; background: var(--cream); display: flex; align-items: center; gap: 12px; border: 1px solid var(--border);">
            <div style="color: var(--gold);">[[ICON_STAR]]</div>
            <span style="font-weight: 500; color: var(--ink);">Оперативный подбор вариантов</span>
          </div>
          <div style="padding: 20px 32px; border-radius: 100px; background: var(--cream); display: flex; align-items: center; gap: 12px; border: 1px solid var(--border);">
            <div style="color: var(--gold);">[[ICON_STAR]]</div>
            <span style="font-weight: 500; color: var(--ink);">Профессиональная команда специалистов</span>
          </div>
        </div>
      </div>
    </section>

    <section style="padding: 80px 0; background: linear-gradient(135deg, #1e2d4a 0%, #16213e 100%); color: white; text-align: center;">
      <div class="container">
        <h2 style="font-size: 32px; font-weight: 300; margin-bottom: 32px;">Свяжитесь с нами</h2>
        <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; max-width: 500px; margin: 0 auto 40px;">
          <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); padding: 16px 24px; border-radius: 12px; width: 100%;">
            <div style="color: var(--gold);">[[ICON_MAP]]</div>
            <span style="font-size: 16px;">г. Душанбе, ул. Бухоро 2</span>
          </div>
          <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.1); padding: 16px 24px; border-radius: 12px; width: 100%;">
            <div style="color: var(--gold);">[[ICON_PHONE]]</div>
            <a href="tel:+992201077771" style="font-size: 16px; color: white; text-decoration: none; font-weight: 500;">+992 201 07 7771</a>
          </div>
        </div>
        <button class="btn-primary" onclick="navigate('listings')" style="font-size: 16px; padding: 16px 36px; border: none; cursor: pointer; border-radius: 100px; background: var(--gold); color: var(--ink); font-weight: 600;">Смотреть объявления</button>
      </div>
    </section>
    </section>


  </div>
</div>`,
  error404: `<div class="page active" id="page-404">
  <div class="error-page-container">
    <div class="error-content">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle><line x1="2" y1="2" x2="22" y2="22"></line></svg>
      </div>
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Страница не найдена</h2>
      <p class="error-message">Возможно, этот адрес уже продан или был указан с ошибкой. Давайте вернёмся на главную и продолжим поиск.</p>
      <button class="btn-primary error-btn" onclick="navigate('home')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        На главную
      </button>
    </div>
  </div>
</div>`,
  error500: `<div class="page active" id="page-500">
  <div class="error-page-container">
    <div class="error-content">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
      </div>
      <h1 class="error-code">500</h1>
      <h2 class="error-title">Техническая неполадка</h2>
      <p class="error-message">Мы уже чиним крышу нашего сервера. Скоро всё снова заработает как надо.</p>
      <button class="btn-primary error-btn" onclick="window.location.reload()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
        Обновить страницу
      </button>
    </div>
  </div>
</div>`,
  team: `<div class="page active" id="page-team">
  <div class="header-padding"></div>
  <section class="listings-hero" style="background-image: linear-gradient(135deg, rgba(30, 45, 74, 0.8) 0%, rgba(212, 175, 55, 0.5) 100%), url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1600&q=80'); background-size: cover; background-position: center 20%; color: white; padding-top: 130px !important; padding-bottom: 70px; text-align: center; position: relative;">
    <div class="container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; z-index: 2;">
      <div style="width: 64px; height: 64px; background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.3); color: white;">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
      </div>
      <h1 style="color: white; font-size: 48px; font-weight: 800; letter-spacing: -1.5px; margin-bottom: 12px; text-shadow: 0 4px 16px rgba(0,0,0,0.4); line-height: 1.1;">Наша Команда</h1>
      <p style="color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500; max-width: 600px; margin: 0 auto; text-shadow: 0 2px 8px rgba(0,0,0,0.3);">Познакомьтесь с профессионалами Barakat Estate, которые помогут вам найти идеальную недвижимость.</p>
    </div>
  </section>

  <section style="padding: 80px 0; background: var(--cream);">
    <div class="container">
      <div id="team-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px;">
        <div style="grid-column: 1/-1; padding: 60px 20px; text-align: center;">
          <div class="spinner" style="margin: 0 auto 20px auto; width: 40px; height: 40px; border: 3px solid rgba(212,175,55,0.2); border-top-color: var(--gold); border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <p style="color: var(--muted);">Загрузка сотрудников...</p>
        </div>
      </div>
    </div>
  </section>
</div>`
} as const;

export type AuraPageName = keyof typeof auraPages;
