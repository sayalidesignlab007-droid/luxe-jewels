import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { HomePage, ShopPage, ProductDetailPage, CartPage, CheckoutPage, OrderHistoryPage } from './pages.jsx'

/* ══════════════════════════════════════════════
   GLOBAL CSS
══════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
:root {
  --bg:#FAF8F5; --bg2:#F5F0E8; --surf:#FFFFFF; --surf2:#F0EBE3;
  --gold:#C9A84C; --gold-l:#E8D5A3; --gold-d:#A0772A;
  --txt:#2C2417; --txt2:#6B5B45; --txt3:#A89880;
  --bdr:#E4DDD3; --bdr2:#C8BFB3;
  --ok:#5A8A5A; --err:#C0534B;
  --fd:'Cormorant Garamond',Georgia,serif;
  --fb:'Jost','Helvetica Neue',sans-serif;
  --nav:72px; --max:1280px;
  --rsm:4px; --rmd:8px; --rlg:16px; --rxl:24px; --rf:9999px;
  --s1:0 1px 4px rgba(44,36,23,.08);
  --s2:0 4px 16px rgba(44,36,23,.12);
  --s3:0 8px 32px rgba(44,36,23,.16);
  --s4:0 16px 48px rgba(44,36,23,.20);
  --sg:0 4px 20px rgba(201,168,76,.30);
  --t:.25s ease; --ts:.4s ease; --tsp:.35s cubic-bezier(.34,1.56,.64,1);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{font-size:16px;scroll-behavior:smooth}
body{background:var(--bg);color:var(--txt);font-family:var(--fb);-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto}
a{text-decoration:none;color:inherit}
ul{list-style:none}
button{cursor:pointer;border:none;background:none;font:inherit}
input,select{font:inherit;border:none;outline:none}

.container{width:100%;max-width:var(--max);margin:0 auto;padding:0 1.5rem}
section{padding:5rem 0}
.sec-title{font-family:var(--fd);font-size:clamp(1.8rem,3vw,3rem);font-weight:300;text-align:center;letter-spacing:.02em}
.sec-sub{font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--txt3);text-align:center;margin-bottom:.5rem}
.gold-line{display:block;width:48px;height:1px;background:var(--gold);margin:1rem auto 2.5rem}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 2rem;font-size:.8rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border-radius:var(--rsm);transition:all var(--t);cursor:pointer;white-space:nowrap;border:2px solid transparent}
.btn-p{background:var(--gold);color:#fff;border-color:var(--gold)}
.btn-p:hover{background:var(--gold-d);border-color:var(--gold-d);box-shadow:var(--sg);transform:translateY(-1px)}
.btn-o{background:transparent;color:var(--gold-d);border-color:var(--gold)}
.btn-o:hover{background:var(--gold);color:#fff;transform:translateY(-1px)}
.btn-d{background:var(--txt);color:var(--gold-l);border-color:var(--txt)}
.btn-d:hover{background:#3d3025;transform:translateY(-1px)}
.btn-sm{padding:.4rem 1rem;font-size:.7rem}
.btn-full{width:100%}
.btn:disabled{opacity:.6;cursor:not-allowed;transform:none}

/* BADGE */
.badge{padding:3px 10px;font-size:.65rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;border-radius:var(--rf);color:#fff;position:absolute;top:.75rem;left:.75rem;z-index:2}
.b-best{background:#C9A84C}.b-sale{background:#C0534B}.b-new{background:#6B8FA3}.b-trend{background:#8A7BAE}.b-prem{background:#2C2417}

/* NAVBAR */
.nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:var(--nav);background:rgba(250,248,245,.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--bdr);transition:box-shadow var(--t)}
.nav.scrolled{box-shadow:var(--s2)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:100%;padding:0 1.5rem;max-width:var(--max);margin:0 auto}
.nav-logo{font-family:var(--fd);font-size:1.5rem;font-weight:300;letter-spacing:.06em;display:flex;align-items:center;gap:.5rem}
.nav-logo span{color:var(--gold)}
.nav-links{display:flex;gap:2.5rem}
.nav-links a{font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--txt2);transition:color var(--t);position:relative}
.nav-links a::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:1px;background:var(--gold);transition:width var(--t)}
.nav-links a:hover,.nav-links a.active{color:var(--gold-d)}
.nav-links a:hover::after,.nav-links a.active::after{width:100%}
.nav-actions{display:flex;align-items:center;gap:.75rem}
.nav-btn{position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:var(--rf);color:var(--txt2);transition:all var(--t)}
.nav-btn:hover{background:var(--bg2);color:var(--gold-d)}
.nav-btn svg{width:20px;height:20px}
.cart-dot{position:absolute;top:4px;right:4px;width:18px;height:18px;background:var(--gold);color:#fff;font-size:9px;font-weight:700;border-radius:var(--rf);display:flex;align-items:center;justify-content:center}
.hamburger{display:none;flex-direction:column;gap:5px;width:28px;cursor:pointer;padding:.5rem}
.hamburger span{display:block;height:1.5px;background:var(--txt);border-radius:2px;transition:all var(--t)}
.hamburger.open span:nth-child(1){transform:translateY(6.5px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-6.5px) rotate(-45deg)}
.mob-menu{position:fixed;top:var(--nav);left:0;right:0;background:var(--surf);border-bottom:1px solid var(--bdr);z-index:999;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;box-shadow:var(--s3);animation:fadeIn .2s ease}
.mob-menu a{font-size:1rem;font-weight:500;color:var(--txt);padding:.75rem 0;border-bottom:1px solid var(--bdr);text-transform:uppercase;letter-spacing:.06em}

/* OVERLAY */
.overlay{position:fixed;inset:0;background:rgba(44,36,23,.5);z-index:1100;backdrop-filter:blur(2px)}

/* CART DRAWER */
.drawer{position:fixed;top:0;right:0;bottom:0;width:420px;background:var(--surf);z-index:1300;box-shadow:var(--s4);transform:translateX(100%);transition:transform var(--ts);display:flex;flex-direction:column}
.drawer.open{transform:translateX(0)}
.drawer-hd{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--bdr);flex-shrink:0}
.drawer-title{font-family:var(--fd);font-size:1.4rem;font-weight:300}
.drawer-body{flex:1;overflow-y:auto;padding:1.25rem 1.5rem}
.drawer-items{display:flex;flex-direction:column;gap:1rem}
.d-item{display:flex;gap:1rem;padding-bottom:1rem;border-bottom:1px solid var(--bdr);position:relative}
.d-item:last-child{border-bottom:none}
.d-img{width:76px;height:76px;border-radius:var(--rmd);object-fit:cover;border:1px solid var(--bdr);flex-shrink:0}
.d-info{flex:1}
.d-name{font-family:var(--fd);font-size:1rem;font-weight:300;margin-bottom:.25rem}
.d-meta{font-size:.7rem;color:var(--txt3);margin-bottom:.5rem}
.d-row{display:flex;align-items:center;gap:1rem}
.d-qty{display:flex;align-items:center;gap:.25rem}
.d-qbtn{width:24px;height:24px;border:1px solid var(--bdr);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;font-size:.9rem;cursor:pointer;transition:all var(--t)}
.d-qbtn:hover{border-color:var(--gold);color:var(--gold-d)}
.d-qnum{width:24px;text-align:center;font-size:.85rem;font-weight:500}
.d-price{font-size:.9rem;font-weight:600}
.d-rm{position:absolute;top:0;right:0;width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:var(--txt3);cursor:pointer;transition:color var(--t);border-radius:var(--rf)}
.d-rm:hover{color:var(--err)}
.drawer-ft{padding:1.25rem 1.5rem;border-top:1px solid var(--bdr);flex-shrink:0;background:var(--bg2)}
.d-subtotal{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;font-size:.95rem}
.d-subtotal strong{font-family:var(--fd);font-size:1.5rem;color:var(--gold-d)}
.d-note{font-size:.7rem;color:var(--txt3);text-align:center;margin-top:.75rem}
.drawer-empty{text-align:center;padding:3rem 1rem;opacity:.4;font-size:2rem}

/* TOAST */
.toasts{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.75rem}
.toast{background:var(--txt);color:var(--gold-l);padding:1rem 1.5rem;border-radius:var(--rmd);font-size:.85rem;display:flex;align-items:center;gap:.75rem;box-shadow:var(--s4);min-width:280px;border-left:3px solid var(--gold);animation:slideIn .3s cubic-bezier(.34,1.56,.64,1)}

/* PAGE LOADER */
.loader{position:fixed;inset:0;background:var(--bg);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem}
.loader-ring{width:48px;height:48px;border:2px solid var(--bdr);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite}

/* HERO */
.hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding-top:var(--nav);background:linear-gradient(135deg,#FAF8F5 0%,#F0EBE3 50%,#E8DDD0 100%)}
.hero-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center;max-width:var(--max);margin:0 auto;padding:4rem 1.5rem;width:100%}
.hero-eye{display:inline-flex;align-items:center;gap:.75rem;font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:1.25rem}
.hero-eye::before,.hero-eye::after{content:'';display:block;width:24px;height:1px;background:var(--gold)}
.hero-title{font-family:var(--fd);font-size:clamp(2.5rem,5vw,4rem);font-weight:300;line-height:1.1;margin-bottom:1.5rem}
.hero-title em{font-style:italic;color:var(--gold-d)}
.hero-desc{font-size:1.05rem;color:var(--txt2);line-height:1.8;margin-bottom:2rem;max-width:480px}
.hero-acts{display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:2.5rem}
.hero-stats{display:flex;gap:2.5rem;padding-top:2rem;border-top:1px solid var(--bdr)}
.h-stat-n{font-family:var(--fd);font-size:1.8rem;font-weight:300;display:block}
.h-stat-l{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3)}
.hero-visual{position:relative;display:flex;align-items:center;justify-content:center}
.hero-frame{position:relative;width:100%;max-width:520px;aspect-ratio:4/5;border-radius:var(--rxl);overflow:hidden;box-shadow:var(--s4)}
.hero-frame img{width:100%;height:100%;object-fit:cover;transition:transform 8s ease}
.hero-frame:hover img{transform:scale(1.04)}
.hero-frame-ov{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 60%,rgba(44,36,23,.3) 100%)}
.hero-card{position:absolute;background:var(--surf);border-radius:var(--rlg);padding:1rem 1.25rem;box-shadow:var(--s3);display:flex;align-items:center;gap:.75rem;animation:float 3s ease-in-out infinite}
.hero-card-1{bottom:2rem;left:-24px}
.hero-card-2{top:2rem;right:-24px;animation-delay:1.5s}
.h-card-icon{width:36px;height:36px;background:var(--bg2);border-radius:var(--rf);display:flex;align-items:center;justify-content:center;font-size:16px}
.h-card-info strong{display:block;font-size:.85rem;font-weight:600}
.h-card-info span{font-size:.7rem;color:var(--txt3)}

/* CATEGORIES */
.cats{padding:4rem 0;background:var(--bg2)}
.cats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:1.25rem}
.cat-card{position:relative;border-radius:var(--rlg);overflow:hidden;aspect-ratio:3/4;cursor:pointer;display:block}
.cat-card img{width:100%;height:100%;object-fit:cover;transition:transform var(--ts)}
.cat-card:hover img{transform:scale(1.08)}
.cat-ov{position:absolute;inset:0;background:linear-gradient(to bottom,transparent 30%,rgba(44,36,23,.7) 100%)}
.cat-label{position:absolute;bottom:0;left:0;right:0;padding:1.25rem 1rem;text-align:center}
.cat-name{font-family:var(--fd);font-size:1.2rem;font-weight:300;color:#fff;display:block;letter-spacing:.04em}
.cat-count{font-size:.7rem;color:var(--gold-l);letter-spacing:.12em;text-transform:uppercase;display:block;transform:translateY(8px);opacity:0;transition:all var(--t)}
.cat-card:hover .cat-count{transform:translateY(0);opacity:1}

/* FEATURED TABS */
.feat-tabs{display:flex;justify-content:center;gap:.5rem;margin-bottom:2.5rem;flex-wrap:wrap}
.feat-tab{padding:.5rem 1.5rem;font-size:.8rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--txt2);border:1px solid var(--bdr);border-radius:var(--rf);background:transparent;cursor:pointer;transition:all var(--t)}
.feat-tab:hover,.feat-tab.active{background:var(--gold);border-color:var(--gold);color:#fff}

/* PROMO */
.promo{background:linear-gradient(135deg,var(--txt) 0%,#3d3025 100%);padding:4rem 0;text-align:center}
.promo-sub{font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
.promo-title{font-family:var(--fd);font-size:clamp(1.8rem,4vw,3rem);font-weight:300;color:#FAF8F5;margin-bottom:1rem}
.promo-desc{color:#8A7B6A;font-size:1rem;margin-bottom:2rem}

/* TESTIMONIALS */
.testi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}
.testi-card{background:var(--surf);border-radius:var(--rlg);padding:2rem;border:1px solid var(--bdr);transition:all var(--t)}
.testi-card:hover{box-shadow:var(--s2);transform:translateY(-4px)}
.testi-stars{color:var(--gold);font-size:.9rem;margin-bottom:1rem;letter-spacing:2px}
.testi-text{font-family:var(--fd);font-size:1.05rem;font-style:italic;color:var(--txt);line-height:1.8;margin-bottom:1.5rem}
.testi-author{display:flex;align-items:center;gap:.75rem}
.testi-av{width:40px;height:40px;border-radius:var(--rf);background:var(--gold-l);display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-size:1.1rem;color:var(--gold-d);font-weight:600}
.testi-name{font-size:.85rem;font-weight:600}
.testi-loc{font-size:.7rem;color:var(--txt3)}

/* PRODUCT GRID */
.pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem}
.pgrid-3{grid-template-columns:repeat(3,1fr)}
.pgrid-list{grid-template-columns:1fr}

/* PRODUCT CARD */
.pc{background:var(--surf);border-radius:var(--rlg);overflow:hidden;border:1px solid var(--bdr);transition:all var(--t);position:relative}
.pc:hover{box-shadow:var(--s3);transform:translateY(-6px);border-color:var(--gold-l)}
.pc-img-wrap{position:relative;aspect-ratio:1;overflow:hidden;background:var(--bg2)}
.pc-img{width:100%;height:100%;object-fit:cover;transition:transform var(--ts)}
.pc:hover .pc-img{transform:scale(1.06)}
.pc-acts{position:absolute;top:.75rem;right:.75rem;display:flex;flex-direction:column;gap:.5rem;z-index:3;transform:translateX(50px);opacity:0;transition:all var(--t)}
.pc:hover .pc-acts{transform:translateX(0);opacity:1}
.pc-act{width:36px;height:36px;background:var(--surf);border-radius:var(--rf);display:flex;align-items:center;justify-content:center;box-shadow:var(--s2);color:var(--txt2);transition:all var(--t);cursor:pointer;font-size:14px;border:none}
.pc-act:hover{background:var(--gold);transform:scale(1.1)}
.pc-qv{position:absolute;bottom:0;left:0;right:0;background:rgba(44,36,23,.88);color:var(--gold-l);font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;padding:.75rem;text-align:center;transform:translateY(100%);transition:transform var(--t);cursor:pointer;z-index:3}
.pc:hover .pc-qv{transform:translateY(0)}
.pc-body{padding:1rem 1.25rem}
.pc-cat{font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:.25rem}
.pc-name{font-family:var(--fd);font-size:1.1rem;font-weight:300;color:var(--txt);margin-bottom:.5rem;transition:color var(--t);line-height:1.3}
.pc:hover .pc-name{color:var(--gold-d)}
.pc-rating{display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem;font-size:.7rem;color:var(--txt3)}
.stars{display:flex;gap:1px;font-size:12px}
.pc-pricing{display:flex;align-items:center;gap:.5rem;margin-bottom:1rem;flex-wrap:wrap}
.pc-price{font-family:var(--fd);font-size:1.25rem;font-weight:600}
.pc-orig{font-size:.8rem;color:var(--txt3);text-decoration:line-through}
.pc-off{font-size:.65rem;color:var(--ok);font-weight:600;background:rgba(90,138,90,.1);padding:2px 6px;border-radius:var(--rf)}
.pc-add{width:100%;padding:.75rem;background:var(--txt);color:var(--gold-l);font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;border-radius:var(--rsm);transition:all var(--t);display:flex;align-items:center;justify-content:center;gap:.5rem;cursor:pointer;border:none}
.pc-add:hover{background:var(--gold);color:#fff;box-shadow:var(--sg)}

/* QUICK VIEW MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(44,36,23,.5);z-index:1200;display:flex;align-items:center;justify-content:center;padding:1.5rem;backdrop-filter:blur(4px)}
.qv-box{background:var(--surf);border-radius:var(--rxl);width:100%;max-width:860px;max-height:90vh;overflow-y:auto;position:relative;box-shadow:var(--s4);animation:modalIn .3s cubic-bezier(.34,1.56,.64,1)}
.qv-grid{display:grid;grid-template-columns:1fr 1fr}
.qv-gallery{aspect-ratio:1;overflow:hidden;border-radius:var(--rxl) 0 0 var(--rxl)}
.qv-gallery img{width:100%;height:100%;object-fit:cover}
.qv-info{padding:2.5rem;display:flex;flex-direction:column;justify-content:center;gap:1rem}
.qv-cat{font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold)}
.qv-name{font-family:var(--fd);font-size:1.8rem;font-weight:300;line-height:1.2}
.qv-pr{display:flex;align-items:baseline;gap:.75rem;flex-wrap:wrap}
.qv-price{font-family:var(--fd);font-size:2rem;font-weight:300}
.qv-orig{font-size:1rem;color:var(--txt3);text-decoration:line-through}
.qv-off{font-size:.8rem;color:var(--ok);font-weight:600}
.qv-desc{font-size:.9rem;color:var(--txt2);line-height:1.8}
.qv-specs{font-size:.85rem;color:var(--txt2);line-height:2;background:var(--bg2);padding:.75rem 1rem;border-radius:var(--rmd)}
.qv-acts{display:flex;flex-direction:column;gap:.75rem}
.modal-close{position:absolute;top:1rem;right:1rem;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:var(--rf);background:var(--bg2);color:var(--txt2);cursor:pointer;z-index:10;transition:all var(--t);font-size:1rem;border:none}
.modal-close:hover{background:var(--txt);color:#fff}

/* SHOP PAGE */
.shop-page{padding-top:calc(var(--nav) + 2rem);min-height:100vh}
.shop-hd{background:var(--bg2);padding:2.5rem 0;text-align:center;border-bottom:1px solid var(--bdr);margin-bottom:2rem}
.shop-search{width:100%;max-width:480px;padding:.75rem 1rem;border:1.5px solid var(--bdr);border-radius:var(--rsm);font-size:.9rem;background:var(--surf);transition:border-color var(--t);display:block;margin-bottom:1.5rem}
.shop-search:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.1);outline:none}
.shop-layout{display:grid;grid-template-columns:240px 1fr;gap:2rem;align-items:start;padding-bottom:4rem}
.sidebar{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rlg);padding:1.5rem;position:sticky;top:calc(var(--nav) + 1.5rem)}
.sb-title{font-size:.8rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--txt);margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--bdr);display:flex;justify-content:space-between;align-items:center}
.sb-clear{font-size:.75rem;color:var(--gold-d);cursor:pointer;font-weight:400;letter-spacing:normal;text-transform:none}
.fg{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--bdr)}
.fg:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.fg-label{font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--txt2);margin-bottom:1rem}
.fg-opts{display:flex;flex-direction:column;gap:.75rem}
.fg-opt{display:flex;align-items:center;gap:.75rem;cursor:pointer;font-size:.85rem;color:var(--txt2);transition:color var(--t)}
.fg-opt:hover{color:var(--gold-d)}
.fg-opt input{accent-color:var(--gold);cursor:pointer}
.fg-count{margin-left:auto;font-size:.7rem;background:var(--bg2);padding:1px 6px;border-radius:var(--rf);color:var(--txt3)}
.price-range{width:100%;accent-color:var(--gold);display:block;margin-bottom:.5rem}
.pr-vals{display:flex;justify-content:space-between;font-size:.7rem;color:var(--txt2)}
.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--bdr);flex-wrap:wrap;gap:1rem}
.tb-count{font-size:.85rem;color:var(--txt2)}
.tb-count strong{color:var(--txt)}
.tb-right{display:flex;align-items:center;gap:1rem}
.sort-sel{padding:.5rem 1rem;border:1px solid var(--bdr);border-radius:var(--rsm);background:var(--surf);font-size:.85rem;color:var(--txt);cursor:pointer}
.view-tog{display:flex;gap:.25rem}
.vbtn{width:32px;height:32px;border:1px solid var(--bdr);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--txt3);transition:all var(--t);background:transparent}
.vbtn.active,.vbtn:hover{border-color:var(--gold);color:var(--gold-d);background:var(--bg2)}
.filter-tog{display:none;align-items:center;gap:.5rem;padding:.5rem 1rem;border:1px solid var(--bdr);border-radius:var(--rsm);font-size:.85rem;background:var(--surf);cursor:pointer}
.no-products{text-align:center;padding:4rem;grid-column:1/-1;color:var(--txt2)}

/* PRODUCT DETAIL */
.pd{padding-top:calc(var(--nav) + 2rem);padding-bottom:5rem}
.pd-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start;margin-bottom:4rem}
.breadcrumb{display:flex;align-items:center;gap:.5rem;padding:1rem 0;font-size:.75rem;color:var(--txt3)}
.breadcrumb a:hover{color:var(--gold-d)}
.bc-sep{color:var(--bdr2)}
.gallery{position:sticky;top:calc(var(--nav) + 1.5rem)}
.gal-main{position:relative;aspect-ratio:1;border-radius:var(--rxl);overflow:hidden;margin-bottom:1rem;background:var(--bg2);cursor:zoom-in}
.gal-main img{width:100%;height:100%;object-fit:cover;transition:transform var(--ts)}
.gal-main:hover img{transform:scale(1.08)}
.gal-hint{position:absolute;bottom:1rem;right:1rem;background:rgba(255,255,255,.9);padding:.4rem .75rem;border-radius:var(--rf);font-size:.7rem;color:var(--txt2);opacity:0;transition:opacity var(--t)}
.gal-main:hover .gal-hint{opacity:1}
.gal-thumbs{display:flex;gap:.75rem}
.gal-thumb{width:72px;height:72px;border-radius:var(--rmd);overflow:hidden;border:2px solid transparent;cursor:pointer;transition:border-color var(--t)}
.gal-thumb img{width:100%;height:100%;object-fit:cover}
.gal-thumb.active,.gal-thumb:hover{border-color:var(--gold)}
.pi-cat{font-size:.7rem;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:.75rem}
.pi-name{font-family:var(--fd);font-size:clamp(2rem,3vw,3rem);font-weight:300;line-height:1.15;margin-bottom:1rem}
.pi-rating{display:flex;align-items:center;gap:.75rem;margin-bottom:1.25rem;font-size:.85rem;color:var(--txt2)}
.pi-pr-row{display:flex;align-items:baseline;gap:1rem;margin-bottom:1.5rem;padding:1.25rem 0;border-top:1px solid var(--bdr);border-bottom:1px solid var(--bdr);flex-wrap:wrap}
.pi-price{font-family:var(--fd);font-size:2.5rem;font-weight:300}
.pi-orig{font-size:1.1rem;color:var(--txt3);text-decoration:line-through}
.pi-save{font-size:.85rem;color:var(--ok);font-weight:600}
.pi-desc{font-size:1rem;color:var(--txt2);line-height:1.9;margin-bottom:1.5rem}
.pi-specs{display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.5rem}
.pi-spec{background:var(--bg2);padding:.75rem 1rem;border-radius:var(--rmd)}
.pi-spec-l{font-size:.7rem;text-transform:uppercase;letter-spacing:.08em;color:var(--txt3);margin-bottom:.25rem}
.pi-spec-v{font-size:.85rem;font-weight:500}
.pi-qty{display:flex;align-items:center;gap:.5rem;margin-bottom:1.5rem}
.qty-lbl{font-size:.85rem;font-weight:600;margin-right:.5rem}
.qty-btn{width:36px;height:36px;border:1px solid var(--bdr);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;font-size:1.1rem;color:var(--txt2);cursor:pointer;transition:all var(--t)}
.qty-btn:hover{border-color:var(--gold);color:var(--gold-d)}
.qty-inp{width:52px;height:36px;text-align:center;border:1px solid var(--bdr);border-radius:var(--rsm);font-size:1rem;background:var(--surf)}
.pi-cta{display:flex;gap:.75rem;margin-bottom:1.5rem}
.pi-trust{display:grid;grid-template-columns:repeat(3,1fr);gap:.75rem;padding:1.25rem 0;border-top:1px solid var(--bdr)}
.trust-item{text-align:center}
.trust-icon{font-size:1.4rem;margin-bottom:.5rem}
.trust-lbl{font-size:.7rem;color:var(--txt2);line-height:1.5}
.pi-tabs{border-top:1px solid var(--bdr);margin-top:3rem}
.pi-tabs-nav{display:flex;border-bottom:1px solid var(--bdr);overflow-x:auto}
.pi-tab-btn{padding:1rem 1.5rem;font-size:.8rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--txt3);border-bottom:2px solid transparent;white-space:nowrap;cursor:pointer;transition:all var(--t);background:none;border-top:none;border-left:none;border-right:none}
.pi-tab-btn:hover,.pi-tab-btn.active{color:var(--gold-d);border-bottom-color:var(--gold)}
.pi-tab-panel{padding:2rem 0;font-size:1rem;color:var(--txt2);line-height:1.9}

/* CART PAGE */
.cart-page{padding-top:calc(var(--nav) + 2rem);padding-bottom:5rem}
.cart-layout{display:grid;grid-template-columns:1fr 360px;gap:2rem;align-items:start}
.cart-box{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rlg);overflow:hidden}
.cart-hd-row{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 40px;gap:1rem;padding:1rem 1.5rem;background:var(--bg2);border-bottom:1px solid var(--bdr);font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3)}
.ci{display:grid;grid-template-columns:2fr 1fr 1fr 1fr 40px;gap:1rem;padding:1.25rem 1.5rem;border-bottom:1px solid var(--bdr);align-items:center;transition:background var(--t)}
.ci:last-child{border-bottom:none}
.ci:hover{background:var(--bg)}
.ci-prod{display:flex;align-items:center;gap:1rem}
.ci-img{width:72px;height:72px;border-radius:var(--rmd);object-fit:cover;border:1px solid var(--bdr);flex-shrink:0}
.ci-name{font-family:var(--fd);font-size:1rem;font-weight:300;margin-bottom:.25rem}
.ci-meta{font-size:.7rem;color:var(--txt3)}
.ci-price{font-size:.95rem;font-weight:500}
.ci-total{font-family:var(--fd);font-size:1.1rem;font-weight:600}
.ci-qty{display:flex;align-items:center;gap:.5rem}
.ci-qbtn{width:28px;height:28px;border:1px solid var(--bdr);border-radius:var(--rsm);display:flex;align-items:center;justify-content:center;font-size:1rem;color:var(--txt2);cursor:pointer;transition:all var(--t)}
.ci-qbtn:hover{border-color:var(--gold);color:var(--gold-d)}
.ci-qnum{width:32px;text-align:center;font-size:.85rem;font-weight:500}
.ci-rm{width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:var(--txt3);border-radius:var(--rf);cursor:pointer;transition:all var(--t);font-size:.8rem}
.ci-rm:hover{background:rgba(192,83,75,.1);color:var(--err)}
.cart-empty-box{text-align:center;padding:5rem 2rem}
.cart-empty-icon{font-size:64px;margin-bottom:1.5rem;opacity:.3}

/* ORDER SUMMARY */
.os{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rlg);padding:1.5rem;position:sticky;top:calc(var(--nav) + 1.5rem)}
.os-title{font-family:var(--fd);font-size:1.5rem;font-weight:300;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--bdr)}
.os-row{display:flex;justify-content:space-between;align-items:center;padding:.75rem 0;font-size:.85rem;color:var(--txt2);border-bottom:1px solid var(--bdr)}
.os-row:last-of-type{border-bottom:none}
.os-row-total{padding:1.25rem 0;font-size:1rem;font-weight:600;color:var(--txt);border-top:2px solid var(--bdr)}
.os-val{font-weight:500;color:var(--txt)}
.os-row-total .os-val{font-family:var(--fd);font-size:1.75rem;color:var(--gold-d)}
.os-free{font-size:.75rem;color:var(--gold-d);background:rgba(201,168,76,.08);padding:.5rem .75rem;border-radius:var(--rsm);margin:.5rem 0}
.coupon{display:flex;gap:.5rem;margin:1rem 0}
.coupon input{flex:1;padding:.75rem 1rem;border:1px solid var(--bdr);border-radius:var(--rsm);font-size:.85rem;background:var(--bg)}
.coupon input:focus{border-color:var(--gold);outline:none}

/* CHECKOUT */
.co-page{padding-top:calc(var(--nav) + 2rem);padding-bottom:5rem}
.co-layout{display:grid;grid-template-columns:1fr 380px;gap:2rem;align-items:start}
.co-form{background:var(--surf);border-radius:var(--rlg);border:1px solid var(--bdr);overflow:hidden}
.co-sec{padding:2rem;border-bottom:1px solid var(--bdr)}
.co-sec:last-child{border-bottom:none}
.co-sec-title{font-family:var(--fd);font-size:1.4rem;font-weight:300;margin-bottom:1.5rem;display:flex;align-items:center;gap:.75rem}
.co-num{width:28px;height:28px;background:var(--gold);color:#fff;border-radius:var(--rf);font-size:.85rem;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem}
.form-row.full{grid-template-columns:1fr}
.form-g{display:flex;flex-direction:column;gap:.5rem}
.form-lbl{font-size:.7rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--txt2)}
.form-inp{padding:.75rem 1rem;border:1.5px solid var(--bdr);border-radius:var(--rsm);font-size:.9rem;color:var(--txt);background:var(--surf);transition:border-color var(--t),box-shadow var(--t);width:100%}
.form-inp:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,168,76,.12);outline:none}
.form-inp::placeholder{color:var(--txt3)}
.form-inp.err{border-color:var(--err)}
.form-err{font-size:.7rem;color:var(--err)}
.pay-opts{display:flex;flex-direction:column;gap:.75rem}
.pay-opt{display:flex;align-items:center;gap:.75rem;padding:1rem;border:1.5px solid var(--bdr);border-radius:var(--rmd);cursor:pointer;transition:all var(--t)}
.pay-opt:hover{border-color:var(--gold-l)}
.pay-opt.selected{border-color:var(--gold);background:rgba(201,168,76,.05)}
.pay-opt input{accent-color:var(--gold)}
.pay-opt-lbl{font-size:.9rem;font-weight:500}
.pay-opt-icon{margin-left:auto;font-size:1.25rem}
.co-summary{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rlg);padding:1.5rem;position:sticky;top:calc(var(--nav) + 1.5rem)}
.co-sum-title{font-family:var(--fd);font-size:1.5rem;font-weight:300;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid var(--bdr)}
.co-items{display:flex;flex-direction:column;gap:1rem;margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--bdr);max-height:280px;overflow-y:auto}
.co-item{display:flex;gap:.75rem;align-items:center}
.co-item-img-wrap{position:relative;flex-shrink:0}
.co-item-img{width:52px;height:52px;border-radius:var(--rmd);object-fit:cover;border:1px solid var(--bdr)}
.co-item-badge{position:absolute;top:-6px;right:-6px;width:18px;height:18px;background:var(--gold);color:#fff;border-radius:var(--rf);font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center}
.co-item-name{font-size:.85rem;font-weight:500;margin-bottom:.25rem}
.co-item-meta{font-size:.7rem;color:var(--txt3)}
.co-item-price{margin-left:auto;font-size:.85rem;font-weight:600;flex-shrink:0}

/* ORDER HISTORY */
.oh-page{padding-top:calc(var(--nav) + 2rem);padding-bottom:5rem}
.oh-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2.5rem}
.oh-stat{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rlg);padding:1.25rem 1.5rem;text-align:center;transition:box-shadow var(--t)}
.oh-stat:hover{box-shadow:var(--s2)}
.oh-stat-v{font-family:var(--fd);font-size:1.75rem;font-weight:300;color:var(--gold-d);display:block;margin-bottom:.25rem}
.oh-stat-l{font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;color:var(--txt3)}
.order-list{display:flex;flex-direction:column;gap:1.25rem}
.order-card{background:var(--surf);border:1px solid var(--bdr);border-radius:var(--rlg);overflow:hidden;transition:box-shadow var(--t)}
.order-card:hover{box-shadow:var(--s2)}
.oc-hd{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;background:var(--bg2);border-bottom:1px solid var(--bdr);flex-wrap:wrap;gap:1rem}
.oc-meta{display:flex;gap:2rem;flex-wrap:wrap}
.oc-ml{font-size:.7rem;letter-spacing:.08em;text-transform:uppercase;color:var(--txt3);margin-bottom:.25rem}
.oc-mv{font-size:.85rem;font-weight:600}
.oc-status{padding:.4rem 1rem;border-radius:var(--rf);font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase}
.oc-body{padding:1.25rem 1.5rem}
.oc-prods{display:flex;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
.oc-thumb{width:64px;height:64px;border-radius:var(--rmd);object-fit:cover;border:1px solid var(--bdr)}
.oc-more{width:64px;height:64px;border-radius:var(--rmd);background:var(--bg2);border:1px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:.85rem;color:var(--txt2);font-weight:500}
.oc-ft{display:flex;align-items:center;justify-content:space-between;padding:1rem 1.5rem;border-top:1px solid var(--bdr);background:var(--bg);flex-wrap:wrap;gap:1rem}
.oc-total{font-size:1rem;color:var(--txt)}
.oc-total strong{font-family:var(--fd);font-size:1.25rem;color:var(--gold-d)}
.oc-acts{display:flex;gap:.75rem}
.oh-empty{text-align:center;padding:5rem;color:var(--txt2)}
.oh-empty-icon{font-size:72px;margin-bottom:1.5rem;opacity:.25}

/* FOOTER */
.footer{background:var(--txt);color:var(--txt3);padding:4rem 0 2rem;margin-top:6rem}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.5fr;gap:3rem;margin-bottom:3rem}
.footer-brand{font-family:var(--fd);font-size:1.5rem;font-weight:300;color:var(--gold-l);margin-bottom:1rem;letter-spacing:.06em}
.footer-tag{font-size:.85rem;line-height:1.8;margin-bottom:1.5rem}
.footer-social{display:flex;gap:.75rem}
.footer-social a{width:36px;height:36px;border:1px solid #4a3f30;border-radius:var(--rf);display:flex;align-items:center;justify-content:center;font-size:.75rem;transition:all var(--t)}
.footer-social a:hover{border-color:var(--gold);color:var(--gold)}
.footer-h{font-size:.75rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#D4C5A9;margin-bottom:1.25rem}
.footer-links{display:flex;flex-direction:column;gap:.75rem}
.footer-links a{font-size:.85rem;transition:color var(--t)}
.footer-links a:hover{color:var(--gold-l)}
.footer-nl-desc{font-size:.85rem;margin-bottom:1rem}
.footer-nl{display:flex;flex-direction:column;gap:.75rem}
.footer-nl input{padding:.75rem 1rem;background:rgba(255,255,255,.06);border:1px solid #4a3f30;border-radius:var(--rsm);color:#fff;font-size:.85rem;transition:border-color var(--t)}
.footer-nl input:focus{border-color:var(--gold);outline:none}
.footer-nl input::placeholder{color:#6B5B45}
.footer-nl button{padding:.75rem 1rem;background:var(--gold);color:#fff;font-size:.8rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;border-radius:var(--rsm);transition:background var(--t);cursor:pointer;border:none}
.footer-nl button:hover{background:var(--gold-d)}
.footer-bt{border-top:1px solid #3a3028;padding-top:1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.footer-copy{font-size:.75rem;color:#5a4f3f}
.footer-pay{display:flex;gap:.5rem}
.footer-pay span{font-size:.7rem;padding:3px 8px;border:1px solid #4a3f30;border-radius:var(--rsm);color:#5a4f3f}

/* ANIMATIONS */
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes modalIn{from{transform:scale(.92) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}

/* RESPONSIVE */
@media(max-width:1024px){
  .nav-links{display:none}
  .hamburger{display:flex}
  .hero-grid{grid-template-columns:1fr;text-align:center;padding:3rem 1.5rem}
  .hero-acts,.hero-stats{justify-content:center}
  .hero-visual{order:-1}
  .hero-frame{max-width:380px;margin:0 auto}
  .hero-card-2{display:none}
  .cats-grid{grid-template-columns:repeat(3,1fr)}
  .pgrid{grid-template-columns:repeat(3,1fr)}
  .shop-layout{grid-template-columns:1fr}
  .sidebar{display:none;position:fixed;top:0;left:0;bottom:0;width:300px;z-index:1400;overflow-y:auto;border-radius:0}
  .sidebar.open{display:block}
  .filter-tog{display:flex}
  .pd-grid{grid-template-columns:1fr;gap:2rem}
  .gallery{position:static}
  .cart-layout{grid-template-columns:1fr}
  .os{position:static}
  .co-layout{grid-template-columns:1fr}
  .co-summary{position:static}
  .footer-grid{grid-template-columns:1fr 1fr;gap:2rem}
  .oh-stats{grid-template-columns:repeat(2,1fr)}
  .testi-grid{grid-template-columns:1fr 1fr}
  .qv-grid{grid-template-columns:1fr}
  .qv-gallery{aspect-ratio:16/9;border-radius:var(--rxl) var(--rxl) 0 0}
}
@media(max-width:640px){
  :root{--nav:60px}
  .container{padding:0 1rem}
  section{padding:3rem 0}
  .hero-title{font-size:2rem}
  .hero-acts{flex-direction:column}
  .hero-card-1{display:none}
  .cats-grid{grid-template-columns:repeat(2,1fr);gap:.75rem}
  .pgrid{grid-template-columns:repeat(2,1fr);gap:.75rem}
  .pgrid-list{grid-template-columns:1fr}
  .cart-hd-row{display:none}
  .ci{grid-template-columns:1fr}
  .drawer{width:100%}
  .form-row{grid-template-columns:1fr}
  .footer-grid{grid-template-columns:1fr}
  .oh-stats{grid-template-columns:repeat(2,1fr)}
  .testi-grid{grid-template-columns:1fr}
  .pi-cta{flex-direction:column}
  .pi-specs{grid-template-columns:1fr}
}
`

/* ══════════════════════════════════════════════
   CART CONTEXT
══════════════════════════════════════════════ */
const CartCtx = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const ex = state.items.find(i => i.id === action.p.id)
      const items = ex
        ? state.items.map(i => i.id === action.p.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.p, qty: 1 }]
      return { ...state, items }
    }
    case 'REMOVE': return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'QTY': {
      if (action.qty < 1) return { ...state, items: state.items.filter(i => i.id !== action.id) }
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) }
    }
    case 'CLEAR': return { ...state, items: [] }
    case 'DRAWER': return { ...state, open: action.v }
    case 'LOAD': return { ...state, items: action.items }
    default: return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], open: false })
  useEffect(() => {
    const s = localStorage.getItem('lj_cart')
    if (s) dispatch({ type: 'LOAD', items: JSON.parse(s) })
  }, [])
  useEffect(() => {
    localStorage.setItem('lj_cart', JSON.stringify(state.items))
  }, [state.items])
  const total = state.items.reduce((s, i) => s + i.qty, 0)
  const sub   = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const ship  = sub > 2000 ? 0 : 99
  return (
    <CartCtx.Provider value={{ ...state, dispatch, total, sub, ship, grand: sub + ship }}>
      {children}
    </CartCtx.Provider>
  )
}
export const useCart = () => useContext(CartCtx)

/* ══════════════════════════════════════════════
   TOAST CONTEXT
══════════════════════════════════════════════ */
const ToastCtx = createContext()
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const show = useCallback((msg) => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="toasts">
        {toasts.map(t => <div key={t.id} className="toast">✓ {t.msg}</div>)}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => useContext(ToastCtx)

/* ══════════════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════════════ */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/* ══════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu]         = useState(false)
  const { total, dispatch }     = useCart()
  const loc = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  useEffect(() => setMenu(false), [loc])

  const links = [{ to: '/', l: 'Home' }, { to: '/shop', l: 'Shop' }, { to: '/orders', l: 'Orders' }]

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">💎 <span>Luxe</span>Jewels</Link>
          <div className="nav-links">
            {links.map(x => <Link key={x.to} to={x.to} className={loc.pathname === x.to ? 'active' : ''}>{x.l}</Link>)}
          </div>
          <div className="nav-actions">
            <Link to="/cart" className="nav-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {total > 0 && <span className="cart-dot">{total}</span>}
            </Link>
            <button className="nav-btn" onClick={() => dispatch({ type: 'DRAWER', v: true })}>🛍️</button>
            <button className={`hamburger ${menu ? 'open' : ''}`} onClick={() => setMenu(o => !o)}>
              <span/><span/><span/>
            </button>
          </div>
        </div>
      </nav>
      {menu && (
        <div className="mob-menu">
          {links.map(x => <Link key={x.to} to={x.to}>{x.l}</Link>)}
          <Link to="/cart">Cart ({total})</Link>
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════
   CART DRAWER
══════════════════════════════════════════════ */
function CartDrawer() {
  const { items, open, dispatch, sub, total } = useCart()
  return (
    <>
      {open && <div className="overlay" onClick={() => dispatch({ type: 'DRAWER', v: false })} />}
      <div className={`drawer ${open ? 'open' : ''}`}>
        <div className="drawer-hd">
          <span className="drawer-title">Cart · <span style={{ color: 'var(--gold)', fontFamily: 'var(--fb)', fontSize: '1rem' }}>{total} items</span></span>
          <button className="modal-close" onClick={() => dispatch({ type: 'DRAWER', v: false })}>✕</button>
        </div>
        <div className="drawer-body">
          {!items.length
            ? <div className="drawer-empty">🛍️<p style={{ fontSize: '1rem', marginTop: '1rem', color: 'var(--txt3)' }}>Cart is empty</p></div>
            : <div className="drawer-items">
                {items.map(item => {
                  const img = item.imgs?.[0] || item.images?.[0] || ''
                  return (
                    <div key={item.id} className="d-item">
                      <img src={img} alt={item.name} className="d-img" />
                      <div className="d-info">
                        <div className="d-name">{item.name}</div>
                        <div className="d-meta">{item.cat || item.category}</div>
                        <div className="d-row">
                          <div className="d-qty">
                            <button className="d-qbtn" onClick={() => dispatch({ type: 'QTY', id: item.id, qty: item.qty - 1 })}>−</button>
                            <span className="d-qnum">{item.qty}</span>
                            <button className="d-qbtn" onClick={() => dispatch({ type: 'QTY', id: item.id, qty: item.qty + 1 })}>+</button>
                          </div>
                          <span className="d-price">₹{(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      </div>
                      <button className="d-rm" onClick={() => dispatch({ type: 'REMOVE', id: item.id })}>✕</button>
                    </div>
                  )
                })}
              </div>
          }
        </div>
        {!!items.length && (
          <div className="drawer-ft">
            <div className="d-subtotal"><span>Subtotal</span><strong>₹{sub.toLocaleString()}</strong></div>
            <Link to="/cart" className="btn btn-d btn-full" onClick={() => dispatch({ type: 'DRAWER', v: false })}>View Cart</Link>
            <Link to="/checkout" className="btn btn-p btn-full" style={{ marginTop: '.5rem' }} onClick={() => dispatch({ type: 'DRAWER', v: false })}>Checkout →</Link>
            <p className="d-note">Free shipping on orders above ₹2000</p>
          </div>
        )}
      </div>
    </>
  )
}
/* ══════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">💎 LuxeJewels</div>
            <p className="footer-tag">Crafting timeless pieces that celebrate life's most precious moments.</p>
            <div className="footer-social">
              {['I', 'F', 'P'].map(s => <a key={s} href="#">{s}</a>)}
            </div>
          </div>
          <div>
            <h4 className="footer-h">Shop</h4>
            <div className="footer-links">
              {['Chains', 'Necklaces', 'Rings', 'Bracelets', 'Earrings'].map(c => (
                <Link key={c} to={`/shop?cat=${c.toLowerCase()}`}>{c}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="footer-h">Help</h4>
            <div className="footer-links">
              {['Shipping', 'Returns', 'Size Guide', 'Contact'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
          </div>
          <div>
            <h4 className="footer-h">Newsletter</h4>
            <p className="footer-nl-desc">Get 10% off your first order.</p>
            <div className="footer-nl">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
        <div className="footer-bt">
          <span className="footer-copy">© 2025 LuxeJewels. All rights reserved.</span>
          <div className="footer-pay">
            {['UPI', 'VISA', 'MC', 'COD'].map(p => <span key={p}>{p}</span>)}
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ══════════════════════════════════════════════
   PAGE LOADER
══════════════════════════════════════════════ */
function Loader() {
  const [v, setV] = useState(true)
  useEffect(() => { setTimeout(() => setV(false), 1200) }, [])
  if (!v) return null
  return <div className="loader"><div style={{ fontSize: 48 }}>💎</div><div className="loader-ring" /></div>
}

/* ══════════════════════════════════════════════
   APP
══════════════════════════════════════════════ */
export default function App() {
  return (
    <>
      <style>{css}</style>
      <ToastProvider>
        <CartProvider>
          <Loader />
           <ScrollToTop />
          <Navbar />
          <CartDrawer />
          <main style={{ paddingTop: 0 }}>
            <Routes>
              <Route path="/"        element={<HomePage />} />
              <Route path="/shop"    element={<ShopPage />} />
              <Route path="/shop/:id" element={<ProductDetailPage />} />
              <Route path="/cart"    element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders"  element={<OrderHistoryPage />} />
            </Routes>
          </main>
          <Footer />
        </CartProvider>
      </ToastProvider>
    </>
  )
}
