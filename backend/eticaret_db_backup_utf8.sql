--
-- PostgreSQL database dump
--

-- Dumped from database version 15.14
-- Dumped by pg_dump version 15.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: furkan
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO furkan;

--
-- Name: kullanici; Type: TABLE; Schema: public; Owner: furkan
--

CREATE TABLE public.kullanici (
    id integer NOT NULL,
    email character varying(120) NOT NULL,
    sifre_hash character varying(256) NOT NULL,
    olusturulma_tarihi timestamp without time zone,
    ad character varying(50),
    soyad character varying(50),
    role character varying(20) NOT NULL
);


ALTER TABLE public.kullanici OWNER TO furkan;

--
-- Name: kullanici_favorileri; Type: TABLE; Schema: public; Owner: furkan
--

CREATE TABLE public.kullanici_favorileri (
    kullanici_id integer NOT NULL,
    urun_id integer NOT NULL
);


ALTER TABLE public.kullanici_favorileri OWNER TO furkan;

--
-- Name: kullanici_id_seq; Type: SEQUENCE; Schema: public; Owner: furkan
--

CREATE SEQUENCE public.kullanici_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.kullanici_id_seq OWNER TO furkan;

--
-- Name: kullanici_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: furkan
--

ALTER SEQUENCE public.kullanici_id_seq OWNED BY public.kullanici.id;


--
-- Name: siparis; Type: TABLE; Schema: public; Owner: furkan
--

CREATE TABLE public.siparis (
    id integer NOT NULL,
    kullanici_id integer NOT NULL,
    toplam_fiyat numeric(10,2) NOT NULL,
    durum character varying(50) NOT NULL,
    olusturulma_tarihi timestamp without time zone
);


ALTER TABLE public.siparis OWNER TO furkan;

--
-- Name: siparis_id_seq; Type: SEQUENCE; Schema: public; Owner: furkan
--

CREATE SEQUENCE public.siparis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.siparis_id_seq OWNER TO furkan;

--
-- Name: siparis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: furkan
--

ALTER SEQUENCE public.siparis_id_seq OWNED BY public.siparis.id;


--
-- Name: siparis_urunleri; Type: TABLE; Schema: public; Owner: furkan
--

CREATE TABLE public.siparis_urunleri (
    siparis_id integer NOT NULL,
    urun_id integer NOT NULL,
    adet integer NOT NULL
);


ALTER TABLE public.siparis_urunleri OWNER TO furkan;

--
-- Name: urun; Type: TABLE; Schema: public; Owner: furkan
--

CREATE TABLE public.urun (
    id integer NOT NULL,
    ad character varying(100) NOT NULL,
    aciklama text NOT NULL,
    fiyat numeric(10,2) NOT NULL,
    stok_miktari integer NOT NULL,
    resim_url character varying(255),
    olusturulma_tarihi timestamp without time zone
);


ALTER TABLE public.urun OWNER TO furkan;

--
-- Name: urun_id_seq; Type: SEQUENCE; Schema: public; Owner: furkan
--

CREATE SEQUENCE public.urun_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.urun_id_seq OWNER TO furkan;

--
-- Name: urun_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: furkan
--

ALTER SEQUENCE public.urun_id_seq OWNED BY public.urun.id;


--
-- Name: kullanici id; Type: DEFAULT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.kullanici ALTER COLUMN id SET DEFAULT nextval('public.kullanici_id_seq'::regclass);


--
-- Name: siparis id; Type: DEFAULT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.siparis ALTER COLUMN id SET DEFAULT nextval('public.siparis_id_seq'::regclass);


--
-- Name: urun id; Type: DEFAULT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.urun ALTER COLUMN id SET DEFAULT nextval('public.urun_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: furkan
--

COPY public.alembic_version (version_num) FROM stdin;
469ec4880f5c
\.


--
-- Data for Name: kullanici; Type: TABLE DATA; Schema: public; Owner: furkan
--

COPY public.kullanici (id, email, sifre_hash, olusturulma_tarihi, ad, soyad, role) FROM stdin;
23	ado@hotmail.com	scrypt:32768:8:1$9NUYoA3xqMnAnLqv$6bee091f6444369b319a4ffde086084c0c37093fcdb68b6d2ba915216d6ec031934f6dffd5625544fbdfed3ccdf3b1c41d1e801f4d593d0a8ef1f25f6842d1bb	2025-09-22 17:03:12.992784	aaadooo	adooo	user
24	adooooo@hotmail.com	scrypt:32768:8:1$kRNHZBwi9mWFJ8Pv$bc7d6f7718f336b7357531eb74430d7b43403c5e1a9f5709b572876adbc15914251ad627c5f42091dedad7c13274d77920825d5a9954178c8fa74629eebe90dd	2025-09-22 17:03:41.761652	ado	ado	user
13	creaturadei@gmail.com	scrypt:32768:8:1$FFakwcnDRY1h6ZUA$585dc041f85d7ec62ed9f8b6c509279dee788b12dc16474bbe746383545773ff7041009cc6dff8be060322a8ce6d0a283919273c3d653536e98322432505ed8a	2025-09-16 12:49:57.178678	afaf	awawgawg	user
25	moda@hotmail.com	scrypt:32768:8:1$FyvxCAmdcQ6OqeZH$41f55bef15a703d78623e3e0b08b9dd77d4a0fc1f54ef3c69ab5d4cd548035c5270af56690a910cc7e4fa5b3849751b185b64c4bb021b77d28bc3b8b10977869	2025-09-22 17:06:50.566843	moda	moda	moderator
16	deneme@hotmail.com	scrypt:32768:8:1$wMzpxCF4V2hEidgs$157bcd06c6d29a589855499dd4c5bbd95607b108f500426ae12dbe87016caf730a72cd169d8f33ebd8975615acc1396f28e9b36497faf0c0274aef68fe367824	2025-09-16 13:48:41.374697	deneme	deneme	user
1	abc@hotmail.com	scrypt:32768:8:1$9sSG8UR2iiR5HuXg$461fc7110a8cefe229a2209f1aa767e016a429b39f3f94e4e80044a50fccefb762deed669225c3d640bb6a1651248d588796251c26e71f7c7f1901963a05c1d0	2025-09-06 18:21:33.061904	Admin	Hesab─▒	admin
18	aawgaawg@hotmail.com	scrypt:32768:8:1$mZa0wjGneMG3XpBo$9c6b7ba71c36911960940d1c50b6d731fc86faf6934affa4fdfb9885430677d290d685d20b77b69859afd471ce7a49b9de394432684483954fba41dcea184f06	2025-09-22 13:00:05.983612	dadadad	adadad	user
21	abadc@hotmail.com	scrypt:32768:8:1$hXy8aPmuGKYJ3kpr$9f00c21688864e2289fbb94931698746825afba8181bf89a16ed63b158c538cbbc3c0d2a93a7a00b2f9503a031f609be3f63bef5cd001b589662d7c33dac5735	2025-09-22 13:07:01.68986	aa	a	moderator
12	furkan_58589898@hotmail.com	scrypt:32768:8:1$yeOYeFPJPh2uWcCL$db52732bedb643b1c855be3cc7f4386a8ee50e3c81a3b8805e8eed8ca566269821d97c094a97d8fbf23b76b01c3029ad566d17514e27d4bb750da3fad4a552f3	2025-09-16 12:47:50.154525	birlik	adadf	user
26	ada@hotmail.com	scrypt:32768:8:1$b9gQNt3lpHLusvUb$528a753c5c9ed382c1d0db076735b5b4e23ace83bbee0a775fd7d92b04f57f4df6cb31d026f99870fa136ecf79afd7aad7de0f8f5e9f0ddee932a9b6899a1a7a	2025-09-22 17:29:32.948797	a	a	user
27	mode@hotmail.com	scrypt:32768:8:1$qE3ohws1j2PmAbWG$ee0053771b69729e46a98634d2a05383045e903960938f0a3e299712732e54eb7700bea4ecbd259c24e0e2f0bae56d0c10dcde0db912635d8224a31c7c717f4c	2025-09-22 17:30:18.36125	mode yeni	mode yeniaaaa	user
22	ba@hotmail.com	scrypt:32768:8:1$9gGLrgfMr7kvsybo$da2303aba7696427fb2f147d3a7788b8fae65032e637598aa0a062d9e5f74a6ee0407e0b90905cabdbb0a06c6c6a1086c2269c6fc540c3433f3889ad5b80090a	2025-09-22 13:08:07.547248	b	b	user
28	abcdaaaa@hotmail.com	scrypt:32768:8:1$ZSo4xivOksyUG028$b362114d6ad3a99ad234adb3e3494114b832b69112fd44dbfe3e38aafd3d7cd4a785ae4936712e7896b1a8d71e41f120d0a9ad74bd5fd129a939460afd7ce9c6	2025-09-24 09:21:06.993385	abbbbbbbbbbb	abbbbbbbbbbbb	moderator
\.


--
-- Data for Name: kullanici_favorileri; Type: TABLE DATA; Schema: public; Owner: furkan
--

COPY public.kullanici_favorileri (kullanici_id, urun_id) FROM stdin;
21	19
27	19
\.


--
-- Data for Name: siparis; Type: TABLE DATA; Schema: public; Owner: furkan
--

COPY public.siparis (id, kullanici_id, toplam_fiyat, durum, olusturulma_tarihi) FROM stdin;
8	27	4.00	Beklemede	2025-09-23 17:30:52.079052
1	1	21222335.00	Beklemede	2025-09-06 19:48:47.203325
\.


--
-- Data for Name: siparis_urunleri; Type: TABLE DATA; Schema: public; Owner: furkan
--

COPY public.siparis_urunleri (siparis_id, urun_id, adet) FROM stdin;
1	7	1
8	19	2
1	19	1
\.


--
-- Data for Name: urun; Type: TABLE DATA; Schema: public; Owner: furkan
--

COPY public.urun (id, ad, aciklama, fiyat, stok_miktari, resim_url, olusturulma_tarihi) FROM stdin;
23	2	2	2.00	2		2025-09-16 10:47:52.665925
24	2	2	2.00	2		2025-09-16 10:47:55.531878
7	gagagagagaga	awgawgawga	21222333.00	2	https://www.eskamarket.com/wp-content/uploads/2023/06/Geleneksel-Francala-Somun-Ekmegi-Icin-Gelistirici.jpg	2025-09-14 13:05:44.428111
25	ash	aehawh	22.00	22	https://www.eskamarket.com/wp-content/uploads/2023/06/Geleneksel-Francala-Somun-Ekmegi-Icin-Gelistirici.jpg	2025-09-16 13:01:58.903339
19	2	22	2.00	22	https://www.eskamarket.com/wp-content/uploads/2023/06/Geleneksel-Francala-Somun-Ekmegi-Icin-Gelistirici.jpg	2025-09-16 10:47:35.304005
21	2	2222	2.00	2		2025-09-16 10:47:42.349219
26	kkkkk	kkkkkk	120.00	50	https://www.eskamarket.com/wp-content/uploads/2023/06/Geleneksel-Francala-Somun-Ekmegi-Icin-Gelistirici.jpg	2025-09-22 17:35:59.396603
\.


--
-- Name: kullanici_id_seq; Type: SEQUENCE SET; Schema: public; Owner: furkan
--

SELECT pg_catalog.setval('public.kullanici_id_seq', 28, true);


--
-- Name: siparis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: furkan
--

SELECT pg_catalog.setval('public.siparis_id_seq', 8, true);


--
-- Name: urun_id_seq; Type: SEQUENCE SET; Schema: public; Owner: furkan
--

SELECT pg_catalog.setval('public.urun_id_seq', 26, true);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: kullanici kullanici_email_key; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.kullanici
    ADD CONSTRAINT kullanici_email_key UNIQUE (email);


--
-- Name: kullanici_favorileri kullanici_favorileri_pkey; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.kullanici_favorileri
    ADD CONSTRAINT kullanici_favorileri_pkey PRIMARY KEY (kullanici_id, urun_id);


--
-- Name: kullanici kullanici_pkey; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.kullanici
    ADD CONSTRAINT kullanici_pkey PRIMARY KEY (id);


--
-- Name: siparis siparis_pkey; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.siparis
    ADD CONSTRAINT siparis_pkey PRIMARY KEY (id);


--
-- Name: siparis_urunleri siparis_urunleri_pkey; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.siparis_urunleri
    ADD CONSTRAINT siparis_urunleri_pkey PRIMARY KEY (siparis_id, urun_id);


--
-- Name: urun urun_pkey; Type: CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.urun
    ADD CONSTRAINT urun_pkey PRIMARY KEY (id);


--
-- Name: kullanici_favorileri kullanici_favorileri_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.kullanici_favorileri
    ADD CONSTRAINT kullanici_favorileri_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanici(id);


--
-- Name: kullanici_favorileri kullanici_favorileri_urun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.kullanici_favorileri
    ADD CONSTRAINT kullanici_favorileri_urun_id_fkey FOREIGN KEY (urun_id) REFERENCES public.urun(id);


--
-- Name: siparis siparis_kullanici_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.siparis
    ADD CONSTRAINT siparis_kullanici_id_fkey FOREIGN KEY (kullanici_id) REFERENCES public.kullanici(id);


--
-- Name: siparis_urunleri siparis_urunleri_siparis_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.siparis_urunleri
    ADD CONSTRAINT siparis_urunleri_siparis_id_fkey FOREIGN KEY (siparis_id) REFERENCES public.siparis(id);


--
-- Name: siparis_urunleri siparis_urunleri_urun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: furkan
--

ALTER TABLE ONLY public.siparis_urunleri
    ADD CONSTRAINT siparis_urunleri_urun_id_fkey FOREIGN KEY (urun_id) REFERENCES public.urun(id);


--
-- PostgreSQL database dump complete
--

