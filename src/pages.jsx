import React, { useState, useMemo, useEffect } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { useCart, useToast } from './App.jsx'

/* ══════════════════════════════════════════════
   PRODUCT DATA
══════════════════════════════════════════════ */
export const PRODUCTS = [
  { id:1,  name:'Classic Gold Chain',      cat:'chain',    price:2499, orig:3200, rating:4.5, rev:128,  badge:'Bestseller',
    imgs:['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600','https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600'],
    desc:'18K gold plated classic link chain. Perfect for everyday wear.', mat:'18K Gold Plated', wt:'5.2g', len:'18 inches' },
  { id:2,  name:'Delicate Silver Chain',   cat:'chain',    price:1299, orig:1800, rating:4.3, rev:87,   badge:'Sale',
    imgs:['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600','https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=600'],
    desc:'Sterling silver delicate box chain. Lightweight and elegant.', mat:'Sterling Silver 925', wt:'3.1g', len:'20 inches' },
  { id:3,  name:'Rose Gold Rope Chain',    cat:'chain',    price:2999, orig:3800, rating:4.7, rev:203,  badge:'New',
    imgs:['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600','https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'],
    desc:'Twisted rope design in rose gold. A timeless statement piece.', mat:'Rose Gold Plated', wt:'6.8g', len:'22 inches' },
  { id:4,  name:'Pearl Pendant Necklace',  cat:'necklace', price:3499, orig:4500, rating:4.8, rev:312,  badge:'Bestseller',
    imgs:['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600','https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=600'],
    desc:'Freshwater pearl pendant on a fine gold chain. Timeless elegance.', mat:'Freshwater Pearl + Gold', wt:'4.5g', len:'16 inches' },
  { id:5,  name:'Diamond Choker Necklace', cat:'necklace', price:5999, orig:7500, rating:4.9, rev:156,  badge:'Premium',
    imgs:['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600','https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600'],
    desc:'CZ diamond choker with adjustable clasp. Perfect for special occasions.', mat:'Sterling Silver + CZ', wt:'8.2g', len:'14-16 inches' },
  { id:6,  name:'Layered Gold Necklace',   cat:'necklace', price:4299, orig:5200, rating:4.6, rev:94,   badge:'Trending',
    imgs:['https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=600','https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'],
    desc:'Multi-layer gold necklace set. Makes every outfit look luxurious.', mat:'14K Gold Filled', wt:'7.0g', len:'16+18 inches' },
  { id:7,  name:'Solitaire Diamond Ring',  cat:'ring',     price:6999, orig:8500, rating:4.9, rev:445,  badge:'Bestseller',
    imgs:['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600','https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600'],
    desc:'Classic solitaire CZ diamond ring. The symbol of eternal love.', mat:'18K White Gold + CZ', wt:'3.8g', size:'5-10' },
  { id:8,  name:'Floral Gold Ring',        cat:'ring',     price:1899, orig:2400, rating:4.4, rev:167,  badge:'New',
    imgs:['https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600','https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600'],
    desc:'Delicate floral pattern gold ring. Perfect as a daily wear piece.', mat:'Gold Plated Brass', wt:'2.5g', size:'5-10' },
  { id:9,  name:'Silver Band Ring',        cat:'ring',     price:999,  orig:1400, rating:4.2, rev:289,  badge:'Sale',
    imgs:['https://images.unsplash.com/photo-1608042314453-ae338d682c93?w=600','https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=600'],
    desc:'Minimalist sterling silver band. Stack it or wear it alone.', mat:'Sterling Silver 925', wt:'2.0g', size:'5-10' },
  { id:10, name:'Gold Bangle Bracelet',    cat:'bracelet', price:2799, orig:3500, rating:4.6, rev:198,  badge:'Bestseller',
    imgs:['https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=600','https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'],
    desc:'Solid gold bangle with mirror finish. Classic Indian style.', mat:'Gold Plated Brass', wt:'18g', size:'2.4 inch dia' },
  { id:11, name:'Tennis Bracelet',         cat:'bracelet', price:4599, orig:5800, rating:4.8, rev:123,  badge:'Premium',
    imgs:['https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600','https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=600'],
    desc:'CZ diamond tennis bracelet. Elegant and glamorous.', mat:'Sterling Silver + CZ', wt:'9.5g', size:'7 inches' },
  { id:12, name:'Beaded Charm Bracelet',   cat:'bracelet', price:1499, orig:1900, rating:4.3, rev:76,   badge:'Trending',
    imgs:['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600','https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600'],
    desc:'Rose quartz & gold bead charm bracelet. Bohemian chic.', mat:'Rose Quartz + Gold', wt:'12g', size:'Adjustable' },
  { id:13, name:'Pearl Drop Earrings',     cat:'earring',  price:1699, orig:2200, rating:4.7, rev:342,  badge:'Bestseller',
    imgs:['https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=600','https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600'],
    desc:'Freshwater pearl teardrop earrings. Subtle luxury.', mat:'Freshwater Pearl + Gold', wt:'3.2g', closure:'Push Back' },
  { id:14, name:'Diamond Stud Earrings',   cat:'earring',  price:2499, orig:3200, rating:4.8, rev:511,  badge:'Bestseller',
    imgs:['https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600','https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=600'],
    desc:'Classic CZ diamond studs. Perfect for every occasion.', mat:'18K Gold + CZ', wt:'1.8g', closure:'Screw Back' },
  { id:15, name:'Hoop Earrings Set',       cat:'earring',  price:1299, orig:1700, rating:4.5, rev:234,  badge:'Sale',
    imgs:['https://images.unsplash.com/photo-1610694955371-d4a3e0ce4b52?w=600','https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600'],
    desc:'Set of 3 gold hoop earrings. Stackable style.', mat:'Gold Plated Brass', wt:'4.5g', closure:'Hinged' },
]

const CATS = [
  { k:'all', l:'All', count:15 },
  { k:'chain', l:'Chains', count:3 },
  { k:'necklace', l:'Necklaces', count:3 },
  { k:'ring', l:'Rings', count:3 },
  { k:'bracelet', l:'Bracelets', count:3 },
  { k:'earring', l:'Earrings', count:3 },
]

const CAT_IMGS = {
  chain:    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
  necklace: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=400',
  ring:     'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400',
  bracelet: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400',
  earring:  'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=400',
}

const BADGE_CLS = { Bestseller:'b-best', Sale:'b-sale', New:'b-new', Trending:'b-trend', Premium:'b-prem' }

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const Stars = ({ r }) => (
  <div className="stars">
    {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(r) ? '#C9A84C' : '#E4DDD3' }}>★</span>)}
  </div>
)

const disc = (p, o) => Math.round(((o - p) / o) * 100)

/* ══════════════════════════════════════════════
   QUICK VIEW MODAL
══════════════════════════════════════════════ */
function QuickView({ p, onClose }) {
  const { dispatch } = useCart()
  const { show }     = useToast()
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const fn = e => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', fn) }
  }, [onClose])
  const add = () => {
    dispatch({ type: 'ADD', p })
    dispatch({ type: 'DRAWER', v: true })
    show(`${p.name} added to cart!`)
    onClose()
  }
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="qv-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="qv-grid">
          <div className="qv-gallery"><img src={p.imgs[0]} alt={p.name} /></div>
          <div className="qv-info">
            <div className="qv-cat">{p.cat}</div>
            <h2 className="qv-name">{p.name}</h2>
            <div className="qv-pr">
              <span className="qv-price">₹{p.price.toLocaleString()}</span>
              <span className="qv-orig">₹{p.orig.toLocaleString()}</span>
              <span className="qv-off">{disc(p.price, p.orig)}% off</span>
            </div>
            <p className="qv-desc">{p.desc}</p>
            <div className="qv-specs">
              {p.mat && <div><strong>Material:</strong> {p.mat}</div>}
              {p.wt  && <div><strong>Weight:</strong>   {p.wt}</div>}
              {p.len && <div><strong>Length:</strong>    {p.len}</div>}
              {p.size && <div><strong>Size:</strong>     {p.size}</div>}
            </div>
            <div className="qv-acts">
              <button className="btn btn-p btn-full" onClick={add}>🛒 Add to Cart</button>
              <Link to={`/shop/${p.id}`} className="btn btn-o btn-full" onClick={onClose}>View Full Details</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   PRODUCT CARD
══════════════════════════════════════════════ */
function ProductCard({ p }) {
  const [hover, setHover]   = useState(false)
  const [qv,    setQv]      = useState(false)
  const [wish,  setWish]    = useState(false)
  const { dispatch }        = useCart()
  const { show }            = useToast()

  const add = e => {
    e.preventDefault()
    dispatch({ type: 'ADD', p })
    dispatch({ type: 'DRAWER', v: true })
    show(`${p.name} added to cart!`)
  }

  return (
    <>
      <div className="pc" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <div className="pc-img-wrap">
          <Link to={`/shop/${p.id}`}>
            <img src={hover && p.imgs[1] ? p.imgs[1] : p.imgs[0]} alt={p.name} className="pc-img" loading="lazy" />
          </Link>
          {p.badge && <span className={`badge ${BADGE_CLS[p.badge]}`}>{p.badge}</span>}
          <div className="pc-acts">
            <button className="pc-act" onClick={() => setWish(w => !w)} title="Wishlist">{wish ? '❤️' : '🤍'}</button>
            <button className="pc-act" onClick={() => setQv(true)} title="Quick View">👁</button>
          </div>
          <div className="pc-qv" onClick={() => setQv(true)}>Quick View</div>
        </div>
        <div className="pc-body">
          <div className="pc-cat">{p.cat}</div>
          <Link to={`/shop/${p.id}`}><h3 className="pc-name">{p.name}</h3></Link>
          <div className="pc-rating"><Stars r={p.rating} /><span className="pc-reviews" style={{fontSize:'.7rem',color:'var(--txt3)'}}>({p.rev})</span></div>
          <div className="pc-pricing">
            <span className="pc-price">₹{p.price.toLocaleString()}</span>
            <span className="pc-orig">₹{p.orig.toLocaleString()}</span>
            <span className="pc-off">{disc(p.price, p.orig)}% off</span>
          </div>
          <button className="pc-add" onClick={add}>🛒 Add to Cart</button>
        </div>
      </div>
      {qv && <QuickView p={p} onClose={() => setQv(false)} />}
    </>
  )
}

/* ══════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════ */
export function HomePage() {
  const [tab, setTab] = useState('all')
  const featured = tab === 'all' ? PRODUCTS.slice(0,8) : PRODUCTS.filter(p => p.cat === tab).slice(0,8)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <div className="hero-eye">New Collection 2025</div>
            <h1 className="hero-title">Where Every Piece<br />Tells a <em>Story</em></h1>
            <p className="hero-desc">Discover handcrafted jewellery that celebrates your most precious moments. From delicate chains to statement necklaces.</p>
            <div className="hero-acts">
              <Link to="/shop" className="btn btn-p">Shop Collection</Link>
              <Link to="/shop?cat=necklace" className="btn btn-o">New Arrivals</Link>
            </div>
            <div className="hero-stats">
              {[['500+','Designs'],['12K+','Customers'],['4.9★','Rating']].map(([n,l]) => (
                <div key={l}><span className="h-stat-n">{n}</span><span className="h-stat-l">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800" alt="Jewellery" />
              <div className="hero-frame-ov" />
            </div>
            <div className="hero-card hero-card-1">
              <div className="h-card-icon">💎</div>
              <div className="h-card-info"><strong>Free Shipping</strong><span>Orders above ₹2000</span></div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="h-card-icon">⭐</div>
              <div className="h-card-info"><strong>Certified Quality</strong><span>Hallmarked</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="cats">
        <div className="container">
          <p className="sec-sub">Browse by Category</p>
          <h2 className="sec-title">Our Collections</h2>
          <span className="gold-line" />
          <div className="cats-grid">
            {Object.entries(CAT_IMGS).map(([k, img]) => (
              <Link key={k} to={`/shop?cat=${k}`} className="cat-card">
                <img src={img} alt={k} />
                <div className="cat-ov" />
                <div className="cat-label">
                  <span className="cat-name">{k.charAt(0).toUpperCase()+k.slice(1)}s</span>
                  <span className="cat-count">{PRODUCTS.filter(p=>p.cat===k).length} Pieces</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="featured" style={{ background: 'var(--bg)' }}>
        <div className="container">
          <p className="sec-sub">Handpicked For You</p>
          <h2 className="sec-title">Featured Jewellery</h2>
          <span className="gold-line" />
          <div className="feat-tabs">
            {CATS.map(c => (
              <button key={c.k} className={`feat-tab ${tab===c.k?'active':''}`} onClick={() => setTab(c.k)}>
                {c.l}
              </button>
            ))}
          </div>
          <div className="pgrid">
            {featured.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
          <div style={{ textAlign:'center', marginTop:'3rem' }}>
            <Link to="/shop" className="btn btn-o">View All Products</Link>
          </div>
        </div>
      </section>

      {/* PROMO */}
      <section className="promo">
        <div className="container">
          <p className="promo-sub">Limited Time Offer</p>
          <h2 className="promo-title">Up to 30% Off on All Rings</h2>
          <p className="promo-desc">Use code RING30 at checkout</p>
          <Link to="/shop?cat=ring" className="btn btn-p">Shop Rings Now</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding:'5rem 0', background:'var(--bg2)' }}>
        <div className="container">
          <p className="sec-sub">What Our Customers Say</p>
          <h2 className="sec-title">Real Reviews</h2>
          <span className="gold-line" />
          <div className="testi-grid">
            {[
              { name:'Priya S.', loc:'Mumbai', text:'Absolutely in love with my pearl necklace! The quality is outstanding.', s:5 },
              { name:'Anjali K.', loc:'Pune', text:'Bought the diamond ring for my anniversary. My husband was thrilled!', s:5 },
              { name:'Meera R.', loc:'Bangalore', text:'The gold bangle is exactly as pictured. Very happy with the craftsmanship.', s:4 },
            ].map(t => (
              <div key={t.name} className="testi-card">
                <div className="testi-stars">{'★'.repeat(t.s)}</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-av">{t.name[0]}</div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-loc">{t.loc}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

/* ══════════════════════════════════════════════
   SHOP PAGE
══════════════════════════════════════════════ */
export function ShopPage() {
  const [sp]                      = useSearchParams()
  const [filters, setFilters]     = useState({ cat: sp.get('cat') || 'all', maxPrice: 10000, minRating: 0 })
  const [sort, setSort]           = useState('')
  const [view, setView]           = useState('grid')
  const [search, setSearch]       = useState('')
  const [sidebarOpen, setSB]      = useState(false)

  useEffect(() => {
    const c = sp.get('cat'); if (c) setFilters(f => ({ ...f, cat: c }))
  }, [sp])

  const list = useMemo(() => {
    let l = [...PRODUCTS]
    if (filters.cat !== 'all') l = l.filter(p => p.cat === filters.cat)
    l = l.filter(p => p.price <= filters.maxPrice)
    if (filters.minRating) l = l.filter(p => p.rating >= filters.minRating)
    if (search) l = l.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price-asc')  l.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') l.sort((a,b) => b.price - a.price)
    if (sort === 'rating')     l.sort((a,b) => b.rating - a.rating)
    return l
  }, [filters, sort, search])

  return (
    <div className="shop-page">
      <div className="shop-hd">
        <h1 className="sec-title">Our Jewellery</h1>
        <p className="sec-sub" style={{ marginTop:'.5rem' }}>Handcrafted with love</p>
      </div>
      <div className="container">
        <input className="shop-search" type="text" placeholder="🔍 Search jewellery..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="shop-layout">
          {sidebarOpen && <div className="overlay" onClick={() => setSB(false)} />}
          <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            <div className="sb-title">Filters <button className="sb-clear" onClick={() => setFilters({ cat:'all', maxPrice:10000, minRating:0 })}>Clear All</button></div>
            <div className="fg">
              <div className="fg-label">Category</div>
              <div className="fg-opts">
                {CATS.map(c => (
                  <label key={c.k} className="fg-opt">
                    <input type="radio" name="cat" checked={filters.cat===c.k} onChange={() => setFilters(f=>({...f,cat:c.k}))} />
                    {c.l} <span className="fg-count">{c.count}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="fg">
              <div className="fg-label">Max Price: ₹{filters.maxPrice.toLocaleString()}</div>
              <input type="range" className="price-range" min={500} max={10000} step={100} value={filters.maxPrice} onChange={e => setFilters(f=>({...f,maxPrice:Number(e.target.value)}))} />
              <div className="pr-vals"><span>₹500</span><span>₹10,000</span></div>
            </div>
            <div className="fg">
              <div className="fg-label">Min Rating</div>
              <div className="fg-opts">
                {[4.5,4.0,3.5].map(r => (
                  <label key={r} className="fg-opt">
                    <input type="radio" name="rating" checked={filters.minRating===r} onChange={() => setFilters(f=>({...f,minRating:r}))} />
                    {'★'.repeat(Math.round(r))} {r}+
                  </label>
                ))}
              </div>
            </div>
          </aside>
          <div>
            <div className="toolbar">
              <button className="filter-tog" onClick={() => setSB(o=>!o)}>☰ Filters</button>
              <span className="tb-count"><strong>{list.length}</strong> products</span>
              <div className="tb-right">
                <select className="sort-sel" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <div className="view-tog">
                  <button className={`vbtn ${view==='grid'?'active':''}`} onClick={() => setView('grid')}>⊞</button>
                  <button className={`vbtn ${view==='list'?'active':''}`} onClick={() => setView('list')}>☰</button>
                </div>
              </div>
            </div>
            {list.length === 0
              ? <div className="no-products"><div style={{fontSize:48,opacity:.3}}>💎</div><h3>No products found</h3><p>Try adjusting filters.</p></div>
              : <div className={`pgrid pgrid-3 ${view==='list'?'pgrid-list':''}`}>
                  {list.map(p => <ProductCard key={p.id} p={p} />)}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   PRODUCT DETAIL PAGE
══════════════════════════════════════════════ */
export function ProductDetailPage() {
  const { id }              = useParams()
  const p                   = PRODUCTS.find(x => x.id === Number(id))
  const [img,  setImg]      = useState(0)
  const [qty,  setQty]      = useState(1)
  const [tab,  setTab]      = useState('desc')
  const { dispatch }        = useCart()
  const { show }            = useToast()

  if (!p) return <div className="container" style={{paddingTop:'8rem',textAlign:'center'}}>Product not found</div>

  const related = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0,4)

  const addToCart = () => {
    for (let i = 0; i < qty; i++) dispatch({ type: 'ADD', p })
    dispatch({ type: 'DRAWER', v: true })
    show(`${p.name} added to cart!`)
  }

  return (
    <div className="pd container">
      <div className="breadcrumb">
        <Link to="/">Home</Link><span className="bc-sep">›</span>
        <Link to="/shop">Shop</Link><span className="bc-sep">›</span>
        <Link to={`/shop?cat=${p.cat}`}>{p.cat}</Link><span className="bc-sep">›</span>
        <span>{p.name}</span>
      </div>

      <div className="pd-grid">
        {/* GALLERY */}
        <div className="gallery">
          <div className="gal-main">
            <img src={p.imgs[img]} alt={p.name} />
            <div className="gal-hint">🔍 Hover to zoom</div>
          </div>
          <div className="gal-thumbs">
            {p.imgs.map((im,i) => (
              <div key={i} className={`gal-thumb ${img===i?'active':''}`} onClick={() => setImg(i)}>
                <img src={im} alt={`View ${i+1}`} />
              </div>
            ))}
          </div>
        </div>

        {/* INFO */}
        <div>
          <div className="pi-cat">{p.cat}</div>
          <h1 className="pi-name">{p.name}</h1>
          <div className="pi-rating"><Stars r={p.rating} /><span>{p.rating}</span><span style={{color:'var(--txt3)'}}>({p.rev} reviews)</span></div>
          <div className="pi-pr-row">
            <span className="pi-price">₹{p.price.toLocaleString()}</span>
            <span className="pi-orig">₹{p.orig.toLocaleString()}</span>
            <span className="pi-save">{disc(p.price,p.orig)}% off · Save ₹{(p.orig-p.price).toLocaleString()}</span>
          </div>
          <p className="pi-desc">{p.desc}</p>
          <div className="pi-specs">
            {[['Material',p.mat],['Weight',p.wt],['Length',p.len],['Size',p.size]].filter(([,v])=>v).map(([l,v])=>(
              <div key={l} className="pi-spec"><div className="pi-spec-l">{l}</div><div className="pi-spec-v">{v}</div></div>
            ))}
          </div>
          <div className="pi-qty">
            <span className="qty-lbl">Qty:</span>
            <button className="qty-btn" onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
            <input className="qty-inp" type="number" value={qty} readOnly />
            <button className="qty-btn" onClick={() => setQty(q => q+1)}>+</button>
          </div>
          <div className="pi-cta">
            <button className="btn btn-p" onClick={addToCart}>🛒 Add to Cart</button>
            <button className="btn btn-d" onClick={addToCart}>⚡ Buy Now</button>
          </div>
          <div className="pi-trust">
            {[['🚚','Free Delivery','Above ₹2000'],['↩️','Easy Returns','7 Day Policy'],['✅','Certified','Hallmarked']].map(([icon,l,s])=>(
              <div key={l} className="trust-item">
                <div className="trust-icon">{icon}</div>
                <div className="trust-lbl"><strong>{l}</strong><br/>{s}</div>
              </div>
            ))}
          </div>

          {/* TABS */}
          <div className="pi-tabs">
            <div className="pi-tabs-nav">
              {[['desc','Description'],['details','Details'],['reviews','Reviews']].map(([k,l])=>(
                <button key={k} className={`pi-tab-btn ${tab===k?'active':''}`} onClick={() => setTab(k)}>{l}</button>
              ))}
            </div>
            <div className="pi-tab-panel">
              {tab==='desc'    && <p>{p.desc}</p>}
              {tab==='details' && <ul style={{paddingLeft:'1.5rem',lineHeight:2}}>{[['Material',p.mat],['Weight',p.wt],['Length',p.len]].filter(([,v])=>v).map(([l,v])=><li key={l}><strong>{l}:</strong> {v}</li>)}</ul>}
              {tab==='reviews' && <p>⭐ {p.rating} out of 5 — Based on {p.rev} reviews.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ marginTop:'4rem' }}>
          <h2 className="sec-title" style={{ textAlign:'left', marginBottom:'2rem' }}>You May Also Like</h2>
          <div className="pgrid"><div></div>
            {related.map(x => <ProductCard key={x.id} p={x} />)}
          </div>
        </section>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════
   CART PAGE
══════════════════════════════════════════════ */
export function CartPage() {
  const { items, dispatch, sub, ship, grand } = useCart()
  const nav = useNavigate()

  return (
    <div className="cart-page container">
      <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
        <h1 className="sec-title">Shopping Cart</h1>
        <span className="gold-line" />
      </div>
      {!items.length
        ? <div className="cart-empty-box">
            <div className="cart-empty-icon">🛍️</div>
            <h2 style={{ fontFamily:'var(--fd)', fontSize:'2rem', fontWeight:300, marginBottom:'.75rem' }}>Your cart is empty</h2>
            <p style={{ color:'var(--txt3)', marginBottom:'2rem' }}>Add some beautiful jewellery to get started.</p>
            <Link to="/shop" className="btn btn-p">Continue Shopping</Link>
          </div>
        : <div className="cart-layout">
            <div>
              <div className="cart-box">
                <div className="cart-hd-row"><span>Product</span><span>Price</span><span>Qty</span><span>Total</span><span/></div>
                {items.map(item => (
                  <div key={item.id} className="ci">
                    <div className="ci-prod">
                      <img src={item.imgs?.[0] || item.images?.[0] || ''} alt={item.name} className="ci-img" />
                      <div><div className="ci-name">{item.name}</div><div className="ci-meta">{item.cat} · {item.mat}</div></div>
                    </div>
                    <div className="ci-price">₹{item.price.toLocaleString()}</div>
                    <div className="ci-qty">
                      <button className="ci-qbtn" onClick={() => dispatch({type:'QTY',id:item.id,qty:item.qty-1})}>−</button>
                      <span className="ci-qnum">{item.qty}</span>
                      <button className="ci-qbtn" onClick={() => dispatch({type:'QTY',id:item.id,qty:item.qty+1})}>+</button>
                    </div>
                    <div className="ci-total">₹{(item.price*item.qty).toLocaleString()}</div>
                    <button className="ci-rm" onClick={() => dispatch({type:'REMOVE',id:item.id})}>✕</button>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:'1rem' }}>
                <Link to="/shop" className="btn btn-o btn-sm">← Continue Shopping</Link>
                <button className="btn btn-o btn-sm" onClick={() => dispatch({type:'CLEAR'})}>🗑 Clear Cart</button>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="os">
              <h2 className="os-title">Order Summary</h2>
              <div className="os-row"><span>Subtotal ({items.reduce((s,i)=>s+i.qty,0)} items)</span><span className="os-val">₹{sub.toLocaleString()}</span></div>
              <div className="os-row"><span>Shipping</span><span className="os-val" style={{color:ship===0?'var(--ok)':''}}>{ship===0?'FREE':`₹${ship}`}</span></div>
              {sub < 2000 && <div className="os-free">Add ₹{(2000-sub).toLocaleString()} more for FREE shipping</div>}
              <div className="coupon">
                <input placeholder="Coupon code" />
                <button className="btn btn-o btn-sm">Apply</button>
              </div>
              <div className="os-row os-row-total"><span>Total</span><span className="os-val">₹{grand.toLocaleString()}</span></div>
              <button className="btn btn-p btn-full" style={{marginTop:'1rem'}} onClick={() => nav('/checkout')}>
                Proceed to Checkout →
              </button>
            </div>
          </div>
      }
    </div>
  )
}

/* ══════════════════════════════════════════════
   CHECKOUT PAGE
══════════════════════════════════════════════ */
export function CheckoutPage() {
  const { items, sub, ship, grand, dispatch } = useCart()
  const { show }   = useToast()
  const nav        = useNavigate()
  const [loading,  setLoading]  = useState(false)
  const [payment,  setPayment]  = useState('COD')
  const [success,  setSuccess]  = useState(null)
  const [form,     setForm]     = useState({ name:'',email:'',phone:'',street:'',city:'',state:'',pincode:'' })
  const [errors,   setErrors]   = useState({})

  const validate = () => {
    const e = {}
    if (!form.name)    e.name    = 'Required'
    if (!form.email)   e.email   = 'Required'
    if (!form.phone)   e.phone   = 'Required'
    if (!form.street)  e.street  = 'Required'
    if (!form.city)    e.city    = 'Required'
    if (!form.pincode) e.pincode = 'Required'
    setErrors(e)
    return !Object.keys(e).length
  }

  const place = () => {
    if (!validate()) return
    setLoading(true)
    const orderId = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2,5).toUpperCase()
    const order = {
      orderId, ...form,
      items: items.map(i => ({ id:i.id, name:i.name, img:i.imgs[0], price:i.price, qty:i.qty, cat:i.cat })),
      sub, ship, grand, payment, status:'processing', createdAt: new Date().toISOString()
    }
    const prev = JSON.parse(localStorage.getItem('lj_orders') || '[]')
    localStorage.setItem('lj_orders', JSON.stringify([order, ...prev]))
    dispatch({ type: 'CLEAR' })
    setSuccess(orderId)
    setLoading(false)
  }

  if (success) return (
    <div className="container" style={{ paddingTop:'8rem', textAlign:'center', paddingBottom:'4rem' }}>
      <div style={{ maxWidth:480, margin:'0 auto', background:'var(--surf)', padding:'3rem', borderRadius:'var(--rxl)', border:'1px solid var(--bdr)' }}>
        <div style={{ fontSize:64, marginBottom:'1.5rem' }}>🎉</div>
        <h2 style={{ fontFamily:'var(--fd)', fontSize:'2rem', fontWeight:300, marginBottom:'1rem' }}>Order Placed!</h2>
        <p style={{ color:'var(--txt2)', marginBottom:'1rem' }}>Thank you! We'll confirm your order soon.</p>
        <div style={{ background:'var(--bg2)', padding:'.75rem 1.5rem', borderRadius:'var(--rmd)', display:'inline-block', marginBottom:'2rem', fontSize:'.85rem', color:'var(--txt2)' }}>
          Order ID: <strong style={{ color:'var(--gold-d)' }}>{success}</strong>
        </div><br/>
        <button className="btn btn-p" onClick={() => nav('/orders')}>View Order History</button>
      </div>
    </div>
  )

  const F = ({ name, label, placeholder, full }) => (
    <div className={`form-g ${full ? '' : ''}`}>
      <label className="form-lbl">{label}</label>
      <input className={`form-inp ${errors[name]?'err':''}`} value={form[name]} onChange={e => setForm(f=>({...f,[name]:e.target.value}))} placeholder={placeholder} />
      {errors[name] && <span className="form-err">{errors[name]}</span>}
    </div>
  )

  return (
    <div className="co-page container">
      <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
        <h1 className="sec-title">Checkout</h1>
        <span className="gold-line" />
      </div>
      <div className="co-layout">
        <div className="co-form">
          {/* Contact */}
          <div className="co-sec">
            <h3 className="co-sec-title"><span className="co-num">1</span> Contact Details</h3>
            <div className="form-row"><F name="name" label="Full Name" placeholder="Your name" /><F name="email" label="Email" placeholder="email@example.com" /></div>
            <div className="form-row full"><F name="phone" label="Phone" placeholder="+91 9999 999999" /></div>
          </div>
          {/* Address */}
          <div className="co-sec">
            <h3 className="co-sec-title"><span className="co-num">2</span> Delivery Address</h3>
            <div className="form-row full"><F name="street" label="Street Address" placeholder="House no, Street, Area" /></div>
            <div className="form-row">
              <F name="city" label="City" placeholder="City" />
              <F name="state" label="State" placeholder="State" />
            </div>
            <div className="form-row full"><F name="pincode" label="Pincode" placeholder="400001" /></div>
          </div>
          {/* Payment */}
          <div className="co-sec">
            <h3 className="co-sec-title"><span className="co-num">3</span> Payment Method</h3>
            <div className="pay-opts">
              {[['COD','Cash on Delivery','💵'],['UPI','UPI / GPay / PhonePe','📱'],['CARD','Credit / Debit Card','💳']].map(([v,l,icon])=>(
                <div key={v} className={`pay-opt ${payment===v?'selected':''}`} onClick={() => setPayment(v)}>
                  <input type="radio" readOnly checked={payment===v} /><span className="pay-opt-lbl">{l}</span><span className="pay-opt-icon">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="co-summary">
          <h3 className="co-sum-title">Order Summary</h3>
          <div className="co-items">
            {items.map(item => (
              <div key={item.id} className="co-item">
                <div className="co-item-img-wrap">
                  <img src={item.imgs?.[0] || item.images?.[0] || ''} alt={item.name} className="co-item-img" />
                  <span className="co-item-badge">{item.qty}</span>
                </div>
                <div><div className="co-item-name">{item.name}</div><div className="co-item-meta">{item.cat}</div></div>
                <span className="co-item-price">₹{(item.price*item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          {[['Subtotal',`₹${sub.toLocaleString()}`],['Shipping',ship===0?'FREE':`₹${ship}`],['Total',`₹${grand.toLocaleString()}`]].map(([l,v],i)=>(
            <div key={l} className={`os-row ${i===2?'os-row-total':''}`}>
              <span>{l}</span><span className="os-val" style={i===2?{color:'var(--gold-d)'}:{}}>{v}</span>
            </div>
          ))}
          <button className="btn btn-p btn-full" style={{ marginTop:'1.5rem' }} onClick={place} disabled={loading||!items.length}>
            {loading ? 'Placing Order...' : '✅ Place Order'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   ORDER HISTORY PAGE
══════════════════════════════════════════════ */
export function OrderHistoryPage() {
  const [orders, setOrders]   = useState([])
  const [email,  setEmail]    = useState('')
  const [shown,  setShown]    = useState([])
  const [tracked, setTracked] = useState(null)

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem('lj_orders') || '[]')
    setOrders(all); setShown(all)
  }, [])

  const search = () => {
    if (!email.trim()) { setShown(orders); return }
    setShown(orders.filter(o => o.email.toLowerCase().includes(email.toLowerCase())))
  }

  const statCol = { processing:'#C9A84C', shipped:'#6B8FA3', delivered:'#5A8A5A', cancelled:'#C0534B' }
  const statSteps = { processing:1, shipped:2, delivered:3, cancelled:0 }

  const stats = {
    total: orders.length,
    delivered: orders.filter(o=>o.status==='delivered').length,
    spend: orders.reduce((s,o)=>s+(o.grand||o.total||0),0),
    items: orders.reduce((s,o)=>s+o.items.reduce((a,i)=>a+(i.qty||1),0),0)
  }

  return (
    <div className="oh-page container">
      <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
        <h1 className="sec-title">Order History</h1>
        <span className="gold-line" />
      </div>

      {/* STATS */}
      <div className="oh-stats">
        {[
          [orders.length,        'Total Orders'],
          [stats.delivered,      'Delivered'],
          [`₹${stats.spend.toLocaleString()}`, 'Total Spent'],
          [stats.items,          'Items Bought']
        ].map(([v,l]) => (
          <div key={l} className="oh-stat">
            <span className="oh-stat-v">{v}</span>
            <span className="oh-stat-l">{l}</span>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div style={{ display:'flex', gap:'.75rem', marginBottom:'2rem', maxWidth:480 }}>
        <input
          style={{ flex:1, padding:'.75rem 1rem', border:'1px solid var(--bdr)', borderRadius:'var(--rsm)', fontSize:'.9rem' }}
          type="email"
          placeholder="Search by email..."
          value={email}
          onChange={e => { setEmail(e.target.value); if(!e.target.value) setShown(orders) }}
        />
        <button className="btn btn-o" onClick={search}>Search</button>
      </div>

      {/* TRACK ORDER POPUP */}
      {tracked && (
        <div className="modal-bg" onClick={() => setTracked(null)}>
          <div style={{ background:'var(--surf)', borderRadius:'var(--rxl)', width:'100%', maxWidth:500, padding:'2.5rem', position:'relative', boxShadow:'var(--s4)' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setTracked(null)}>✕</button>
            <h3 style={{ fontFamily:'var(--fd)', fontSize:'1.5rem', fontWeight:300, marginBottom:'.5rem' }}>Track Order</h3>
            <p style={{ fontSize:'.8rem', color:'var(--txt3)', marginBottom:'2rem' }}>Order ID: <strong style={{color:'var(--gold-d)'}}>{tracked.orderId}</strong></p>

            {/* STEPS */}
            <div style={{ position:'relative', marginBottom:'2rem' }}>
              {['Order Placed','Processing','Shipped','Delivered'].map((step, i) => {
                const stepNum = i
                const currentStep = statSteps[tracked.status] ?? 1
                const done = stepNum < currentStep
                const active = stepNum === currentStep - 1
                return (
                  <div key={`step-${i}`} style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom: i < 3 ? '1.5rem' : 0, position:'relative' }}>
                    {/* Line */}
                    {i < 3 && (
                      <div style={{
                        position:'absolute', left:14, top:28, width:2, height:'calc(100% + .5rem)',
                        background: done ? 'var(--gold)' : 'var(--bdr)'
                      }} />
                    )}
                    {/* Circle */}
                    <div style={{
                      width:28, height:28, borderRadius:'50%', flexShrink:0, zIndex:1,
                      background: done || active ? 'var(--gold)' : 'var(--bdr)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'#fff', fontSize:'.8rem', fontWeight:600
                    }}>
                      {done ? '✓' : i+1}
                    </div>
                    <div>
                      <div style={{ fontSize:'.9rem', fontWeight:600, color: done||active ? 'var(--txt)' : 'var(--txt3)' }}>{step}</div>
                      <div style={{ fontSize:'.75rem', color:'var(--txt3)' }}>
                        {active ? 'In Progress...' : done ? 'Completed' : 'Pending'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Items */}
            <div style={{ borderTop:'1px solid var(--bdr)', paddingTop:'1.5rem' }}>
              <div style={{ fontSize:'.8rem', fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', color:'var(--txt3)', marginBottom:'1rem' }}>Items Ordered</div>
              {tracked.items.map((item, idx) => (
                <div key={`track-item-${item.id || idx}`} style={{ display:'flex', gap:'.75rem', alignItems:'center', marginBottom:'.75rem' }}>
                  <img src={item.img || item.imgs?.[0] || item.images?.[0] || ''} alt={item.name}
                    style={{ width:44, height:44, borderRadius:'var(--rmd)', objectFit:'cover', border:'1px solid var(--bdr)', flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:'.85rem', fontWeight:500 }}>{item.name}</div>
                    <div style={{ fontSize:'.7rem', color:'var(--txt3)' }}>Qty: {item.qty}</div>
                  </div>
                  <div style={{ fontSize:'.85rem', fontWeight:600 }}>₹{(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ borderTop:'1px solid var(--bdr)', paddingTop:'1rem', marginTop:'.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'.9rem', color:'var(--txt2)' }}>Total Paid</span>
              <span style={{ fontFamily:'var(--fd)', fontSize:'1.5rem', color:'var(--gold-d)' }}>₹{(tracked.grand || tracked.total || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* ORDER LIST */}
      {!shown.length
        ? <div className="oh-empty">
            <div className="oh-empty-icon">📦</div>
            <h2 style={{ fontFamily:'var(--fd)', fontSize:'2rem', fontWeight:300, marginBottom:'.75rem' }}>No orders yet</h2>
            <p style={{ marginBottom:'2rem' }}>Your order history will appear here.</p>
            <Link to="/shop" className="btn btn-p">Start Shopping</Link>
          </div>
        : <div className="order-list">
            {shown.map((o, oidx) => (
              <div key={o.orderId || `order-${oidx}`} className="order-card">
                <div className="oc-hd">
                  <div className="oc-meta">
                    {[
                      ['Order ID',  o.orderId],
                      ['Date',      new Date(o.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})],
                      ['Payment',   o.payment || o.paymentMethod]
                    ].map(([l,v]) => (
                      <div key={`${o.orderId}-${l}`}>
                        <div className="oc-ml">{l}</div>
                        <div className="oc-mv">{v}</div>
                      </div>
                    ))}
                  </div>
                  <span className="oc-status" style={{ background:`${statCol[o.status]}20`, color:statCol[o.status] }}>
                    {o.status.charAt(0).toUpperCase()+o.status.slice(1)}
                  </span>
                </div>

                <div className="oc-body">
                  <div className="oc-prods">
                    {o.items.slice(0,4).map((item, iidx) => (
                      <img
                        key={`${o.orderId}-img-${iidx}`}
                        src={item.img || item.imgs?.[0] || item.images?.[0] || ''}
                        alt={item.name}
                        className="oc-thumb"
                      />
                    ))}
                    {o.items.length > 4 && <div className="oc-more">+{o.items.length-4}</div>}
                  </div>
                  <div style={{ fontSize:'.85rem', color:'var(--txt2)' }}>
                    {o.items.map(i=>i.name).join(', ')}
                  </div>
                </div>

                <div className="oc-ft">
                  <div className="oc-total">Total: <strong>₹{(o.grand||o.total||0).toLocaleString()}</strong></div>
                  <div className="oc-acts">
                    <button className="btn btn-o btn-sm" onClick={() => setTracked(o)}>📦 Track Order</button>
                    <button className="btn btn-d btn-sm">Reorder</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
