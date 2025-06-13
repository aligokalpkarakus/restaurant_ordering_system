nak --
-- PostgreSQL database dump
--

-- Dumped from database version 14.15
-- Dumped by pg_dump version 14.15

-- Started on 2025-06-13 15:42:56

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

--
-- TOC entry 3 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 23805)
-- Name: inventory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    item_name character varying(100),
    quantity integer,
    low_stock_threshold integer
);


ALTER TABLE public.inventory OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 23804)
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_id_seq OWNER TO postgres;

--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 219
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- TOC entry 214 (class 1259 OID 23764)
-- Name: menu_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.menu_items (
    id integer NOT NULL,
    name character varying(100),
    description text,
    price numeric(10,2),
    category character varying(50),
    image_url text,
    dietary_info text
);


ALTER TABLE public.menu_items OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 23763)
-- Name: menu_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.menu_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.menu_items_id_seq OWNER TO postgres;

--
-- TOC entry 3427 (class 0 OID 0)
-- Dependencies: 213
-- Name: menu_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.menu_items_id_seq OWNED BY public.menu_items.id;


--
-- TOC entry 218 (class 1259 OID 23786)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    menu_item_id integer,
    quantity integer,
    special_instructions text
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 23785)
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO postgres;

--
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 217
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- TOC entry 216 (class 1259 OID 23773)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    table_id integer,
    status character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    session_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 23772)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 215
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 222 (class 1259 OID 23812)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    order_id integer,
    amount numeric(10,2),
    method character varying(50),
    is_paid boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 23811)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_id_seq OWNER TO postgres;

--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 221
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 228 (class 1259 OID 23958)
-- Name: recipes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipes (
    id integer NOT NULL,
    menu_item_id integer NOT NULL,
    inventory_item_id integer NOT NULL,
    amount integer NOT NULL,
    CONSTRAINT recipes_amount_check CHECK ((amount > 0))
);


ALTER TABLE public.recipes OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 23957)
-- Name: recipes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recipes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.recipes_id_seq OWNER TO postgres;

--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 227
-- Name: recipes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recipes_id_seq OWNED BY public.recipes.id;


--
-- TOC entry 224 (class 1259 OID 23826)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    type character varying(50),
    data_json jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 23825)
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reports_id_seq OWNER TO postgres;

--
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 223
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- TOC entry 226 (class 1259 OID 23837)
-- Name: table_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.table_sessions (
    id integer NOT NULL,
    table_id integer NOT NULL,
    waiter_id integer,
    is_active boolean DEFAULT true,
    started_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ended_at timestamp without time zone
);


ALTER TABLE public.table_sessions OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 23836)
-- Name: table_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.table_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.table_sessions_id_seq OWNER TO postgres;

--
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 225
-- Name: table_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.table_sessions_id_seq OWNED BY public.table_sessions.id;


--
-- TOC entry 212 (class 1259 OID 23747)
-- Name: tables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tables (
    id integer NOT NULL,
    qr_code text,
    is_occupied boolean DEFAULT false,
    assigned_server_id integer
);


ALTER TABLE public.tables OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 23746)
-- Name: tables_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tables_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tables_id_seq OWNER TO postgres;

--
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 211
-- Name: tables_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tables_id_seq OWNED BY public.tables.id;


--
-- TOC entry 210 (class 1259 OID 23736)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    email character varying(100),
    password_hash text,
    role character varying(50)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 23735)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3216 (class 2604 OID 23808)
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- TOC entry 3212 (class 2604 OID 23767)
-- Name: menu_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items ALTER COLUMN id SET DEFAULT nextval('public.menu_items_id_seq'::regclass);


--
-- TOC entry 3215 (class 2604 OID 23789)
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- TOC entry 3213 (class 2604 OID 23776)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3217 (class 2604 OID 23815)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 23961)
-- Name: recipes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id SET DEFAULT nextval('public.recipes_id_seq'::regclass);


--
-- TOC entry 3220 (class 2604 OID 23829)
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- TOC entry 3222 (class 2604 OID 23840)
-- Name: table_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions ALTER COLUMN id SET DEFAULT nextval('public.table_sessions_id_seq'::regclass);


--
-- TOC entry 3210 (class 2604 OID 23750)
-- Name: tables id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables ALTER COLUMN id SET DEFAULT nextval('public.tables_id_seq'::regclass);


--
-- TOC entry 3209 (class 2604 OID 23739)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3411 (class 0 OID 23805)
-- Dependencies: 220
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory (id, item_name, quantity, low_stock_threshold) FROM stdin;
6	Parmesan	20	5
14	Pasta	100	20
15	Vegetables	80	20
16	Tomato Sauce	40	10
17	Beef Patty	40	10
18	Burger Bun	40	10
19	Lettuce	30	10
27	Mushrooms	30	10
28	Herbs	20	5
30	Honey Mustard	10	3
33	Tahini	10	3
34	Salmon	10	3
35	Quinoa	10	3
36	Hummus	10	3
37	Meat Sauce	10	3
38	Bell Peppers	20	5
39	Lentils	20	5
40	Spaghetti	40	10
41	Mascarpone	10	3
44	Banana	20	5
49	Potato	80	10
50	Chickpeas	40	5
10	Chicken Breast	45	10
11	Rice	95	20
12	Salad Greens	25	10
13	Tzatziki Sauce	15	5
22	Pistachios	8	3
23	Syrup	8	3
48	Butter	48	5
26	Black Tea	100	20
1	Tomato	94	20
3	Basil	27	5
5	Mozzarella	32	10
7	Bread	56	15
29	Breadcrumbs	16	5
45	Mint	9	3
46	Mineral Water	45	10
2	Garlic	43	10
4	Olive Oil	17	5
8	Lentil	72	20
9	Lemon	34	10
20	Chocolate	26	10
43	Milk	20	5
42	Coffee	30	10
21	Cream	18	5
25	Orange Juice	2	5
31	Spinach	19	5
32	Artichoke	9	3
47	Cheese	39	5
24	Fruit	47	10
\.


--
-- TOC entry 3405 (class 0 OID 23764)
-- Dependencies: 214
-- Data for Name: menu_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.menu_items (id, name, description, price, category, image_url, dietary_info) FROM stdin;
1	Bruschetta	Grilled bread topped with fresh tomatoes, garlic, basil, and olive oil	240.00	Appetizers	/uploads/bruschetta.jpg	Vegetarian
2	Mini Cheese Balls	Crispy outside, gooey cheese inside, served with dipping sauce	300.00	Appetizers	/uploads/mini_cheese_balls.jpg	Contains Dairy
3	Lentil Soup	Homemade red lentil soup with lemon and spices	180.00	Appetizers	/uploads/lentil_soup.jpg	Vegan, Gluten-Free
4	Grilled Chicken Plate	Marinated chicken breast served with rice, salad, and tzatziki sauce	400.00	Main Course	/uploads/grilled_chicken_plate.jpg	High Protein
5	Veggie Lasagna	Layers of pasta, vegetables, and cheese baked in tomato sauce	360.00	Main Course	/uploads/veggy_lasagna.jpg	Vegetarian
6	Beef Burger	100% beef patty with lettuce, tomato, cheese, and fries	380.00	Main Course	/uploads/beef_burger.jpg	Contains Gluten, Dairy
7	Chocolate Lava Cake	Warm chocolate cake with a gooey molten center, served with ice cream	200.00	Desserts	/uploads/chocolate_lava_cake.jpg	Contains Dairy, Gluten
8	Baklava	Traditional layered pastry with pistachios and syrup	170.00	Desserts	/uploads/baklava.jpg	Contains Nuts, Gluten
9	Fruit Salad	Mixed seasonal fruits served chilled	140.00	Desserts	/uploads/fruit_salad.jpeg	Vegan, Gluten-Free
10	Fresh Orange Juice	100% freshly squeezed orange juice	120.00	Beverages	/uploads/fresh_orange_juice.jpeg	Vegan
11	Turkish Tea	Strong black tea served traditionally	40.00	Beverages	/uploads/çay.jpg	Vegan
12	Garlic Parmesan Fries	Crispy fries tossed with garlic, herbs, and grated parmesan	180.00	Appetizers	/uploads/garlic_parmesan_fries.jpg	Contains Dairy
13	Stuffed Mushrooms	Mushrooms filled with cheese, herbs, and breadcrumbs	200.00	Appetizers	/uploads/stuffed_mushrooms.jpg	Vegetarian
14	Chicken Tenders	Breaded chicken strips served with honey mustard sauce	220.00	Appetizers	/uploads/chicken_tenders.jpg	Contains Gluten
15	Spinach & Artichoke Dip	Creamy dip served warm with toasted bread	200.00	Appetizers	/uploads/spinach_artichoke_dip.jpg	Vegetarian, Contains Dairy
16	Falafel Balls	Crispy chickpea fritters served with tahini	170.00	Appetizers	/uploads/falafel_balls.jpg	Vegan, Gluten-Free
17	Grilled Salmon	Salmon filet with lemon butter sauce, served with quinoa and greens	530.00	Main Course	/uploads/salmon.jpg	High Protein, Gluten-Free
18	Chicken Alfredo Pasta	Fettuccine pasta with creamy Alfredo sauce and grilled chicken	340.00	Main Course	/uploads/alfredo.jpg	Contains Dairy, Gluten
19	Vegan Buddha Bowl	A mix of grains, roasted vegetables, and hummus	320.00	Main Course	/uploads/vegan_buddha_bowl.jpg	Vegan
20	Spaghetti Bolognese	Classic pasta dish with slow-cooked meat sauce	340.00	Main Course	/uploads/spaghetti-bolognese.jpg	Contains Gluten
21	Stuffed Bell Peppers	Bell peppers filled with rice, lentils, and spices	290.00	Main Course	/uploads/stuffed_peppers.jpg	Vegetarian, Gluten-Free
22	Tiramisu	Italian layered dessert with coffee and mascarpone cream	180.00	Desserts	/uploads/tiramisu.jpg	Contains Dairy, Gluten, Caffeine
23	Panna Cotta	Creamy vanilla dessert with berry coulis	150.00	Desserts	/uploads/panna_cotta.jpg	Contains Dairy
24	Banana Split	Ice cream dessert with banana, chocolate, and toppings	170.00	Desserts	/uploads/bananen-split.jpg	Contains Dairy
25	Mint Lemonade	Fresh lemonade blended with mint leaves	110.00	Beverages	/uploads/mint_lemonade.jpeg	Vegan
26	Sparkling Water	Carbonated mineral water	60.00	Beverages	/uploads/beypazarı.jpg	Vegan, Gluten-Free
27	Cold Brew Coffee	 Slow-steeped coffee served over ice	100.00	Beverages	/uploads/cold_brew.jpg	Vegan, Contains Caffeine
29	Test Pizza	A test pizza for unit testing.	420.00	Main Course	/uploads/vegan_pizza.jpg	Vegan
\.


--
-- TOC entry 3409 (class 0 OID 23786)
-- Dependencies: 218
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, order_id, menu_item_id, quantity, special_instructions) FROM stdin;
1	1	1	1	
2	1	3	1	
3	1	15	1	
4	2	10	1	
5	2	11	1	
6	2	27	1	
7	3	27	1	
8	4	26	1	
9	5	3	1	
10	6	2	1	
11	7	26	1	
12	8	2	1	
13	8	4	1	
14	8	11	1	
15	9	7	1	
16	10	15	1	
17	11	8	1	
18	11	9	1	
19	12	1	1	
20	12	26	1	
21	13	1	1	
22	14	4	4	
23	14	8	1	
24	14	11	2	
25	15	1	1	
26	15	2	2	
27	15	26	3	
28	15	25	1	
29	16	3	3	
30	17	7	1	
\.


--
-- TOC entry 3407 (class 0 OID 23773)
-- Dependencies: 216
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, table_id, status, created_at, session_id) FROM stdin;
1	1	ready	2025-06-06 19:16:52.655916	6
2	1	ready	2025-06-06 19:24:01.164271	6
3	1	ready	2025-06-06 19:26:05.446675	7
4	2	ready	2025-06-06 19:29:20.521787	8
5	2	ready	2025-06-11 21:23:22.97358	11
6	2	ready	2025-06-11 21:36:36.254968	11
7	2	ready	2025-06-11 22:28:51.132775	11
8	1	ready	2025-06-12 00:56:41.135175	13
13	1	ready	2025-06-12 14:09:17.830459	18
10	1	ready	2025-06-12 01:19:42.277658	14
9	1	ready	2025-06-12 01:14:51.094764	14
11	1	ready	2025-06-12 10:07:10.807342	15
12	1	ready	2025-06-12 11:06:01.552525	17
14	1	ready	2025-06-13 00:18:35.72984	21
15	1	ready	2025-06-13 00:30:55.232801	22
16	2	ready	2025-06-13 01:21:39.622989	23
17	3	ready	2025-06-13 01:25:07.916911	24
\.


--
-- TOC entry 3413 (class 0 OID 23812)
-- Dependencies: 222
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, order_id, amount, method, is_paid, created_at) FROM stdin;
1	1	620.00	cash	t	2025-06-06 19:16:52.655916
2	2	260.00	credit_card	t	2025-06-06 19:24:01.164271
3	3	100.00	credit_card	t	2025-06-06 19:26:05.446675
4	4	60.00	credit_card	t	2025-06-06 19:29:20.521787
5	5	180.00	credit_card	t	2025-06-11 21:23:22.97358
6	6	300.00	credit_card	t	2025-06-11 21:36:36.254968
7	7	60.00	credit_card	t	2025-06-11 22:28:51.132775
8	8	740.00	credit_card	t	2025-06-12 00:56:41.135175
9	9	200.00	cash	t	2025-06-12 01:14:51.094764
10	10	200.00	cash	t	2025-06-12 01:19:42.277658
11	11	310.00	cash	t	2025-06-12 10:07:10.807342
12	12	300.00	credit_card	t	2025-06-12 11:06:01.552525
13	13	240.00	credit_card	t	2025-06-12 14:09:17.830459
14	14	1850.00	credit_card	t	2025-06-13 00:18:35.72984
15	15	1130.00	credit_card	t	2025-06-13 00:30:55.232801
16	16	540.00	credit_card	t	2025-06-13 01:21:39.622989
17	17	200.00	cash	t	2025-06-13 01:25:07.916911
\.


--
-- TOC entry 3419 (class 0 OID 23958)
-- Dependencies: 228
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recipes (id, menu_item_id, inventory_item_id, amount) FROM stdin;
1	1	1	2
2	1	2	1
3	1	3	1
4	1	4	1
5	1	7	1
6	2	5	2
7	2	29	1
8	2	4	1
9	3	8	2
10	3	9	1
11	3	2	1
12	3	4	1
13	4	10	1
14	4	11	1
15	4	12	1
16	4	13	1
17	5	14	2
18	5	15	2
19	5	16	1
20	5	5	1
21	6	17	1
22	6	18	1
23	6	19	1
24	6	47	1
25	7	20	2
26	7	21	1
27	8	22	1
28	8	23	1
29	8	48	1
30	9	24	3
31	10	25	1
32	11	26	1
33	12	49	2
34	12	2	1
35	12	6	1
36	13	27	2
37	13	47	1
38	13	28	1
39	13	29	1
40	14	10	1
41	14	29	1
42	14	30	1
43	15	31	1
44	15	32	1
45	15	47	1
46	15	7	1
47	16	50	2
48	16	28	1
49	16	33	1
50	17	34	1
51	17	35	1
52	17	9	1
53	18	14	2
54	18	10	1
55	18	21	1
56	18	6	1
57	19	15	2
58	19	35	1
59	19	36	1
60	20	40	2
61	20	37	1
62	21	38	1
63	21	11	1
64	21	39	1
65	22	41	1
66	22	42	1
67	22	43	1
68	23	21	1
69	23	43	1
70	24	44	1
71	24	20	1
72	24	21	1
73	25	9	2
74	25	45	1
75	26	46	1
76	27	42	1
77	27	43	1
\.


--
-- TOC entry 3415 (class 0 OID 23826)
-- Dependencies: 224
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, type, data_json, created_at) FROM stdin;
\.


--
-- TOC entry 3417 (class 0 OID 23837)
-- Dependencies: 226
-- Data for Name: table_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.table_sessions (id, table_id, waiter_id, is_active, started_at, ended_at) FROM stdin;
1	1	3	f	2025-06-06 10:58:29.830602	2025-06-06 07:58:35.011321
2	1	3	f	2025-06-06 11:01:35.53915	2025-06-06 08:08:44.728345
4	2	3	f	2025-06-06 11:08:50.488526	2025-06-06 08:08:54.7859
3	1	3	f	2025-06-06 11:08:47.699586	2025-06-06 08:08:56.531979
5	1	3	f	2025-06-06 11:14:05.194183	2025-06-06 15:59:35.807148
6	1	3	f	2025-06-06 19:04:25.500071	2025-06-06 16:24:49.702662
8	2	3	f	2025-06-06 19:29:07.887168	2025-06-06 16:49:47.105655
7	1	3	f	2025-06-06 19:25:51.80401	2025-06-06 16:49:47.945739
9	1	3	f	2025-06-11 19:49:24.856177	2025-06-11 16:49:34.47198
10	1	3	f	2025-06-11 19:49:38.81874	2025-06-11 16:49:40.192169
11	2	3	f	2025-06-11 21:23:07.059616	2025-06-11 19:29:58.885459
12	3	3	f	2025-06-11 22:31:17.269429	2025-06-11 19:31:18.164471
13	1	3	f	2025-06-12 00:55:48.135987	2025-06-11 22:04:05.872015
14	1	3	f	2025-06-12 01:14:32.862149	2025-06-11 22:23:00.598022
15	1	3	f	2025-06-12 10:06:58.431789	2025-06-12 07:50:43.850152
16	1	2	f	2025-06-12 10:58:12.076867	2025-06-12 08:05:52.521499
17	1	1	f	2025-06-12 11:06:01.535915	2025-06-12 11:07:55.596236
19	1	3	f	2025-06-13 00:11:41.877318	2025-06-12 21:11:45.916117
18	3	1	f	2025-06-12 14:09:17.810146	2025-06-12 21:12:02.164077
20	3	3	f	2025-06-13 00:12:03.076137	2025-06-12 21:12:03.966078
21	1	3	f	2025-06-13 00:15:08.921628	2025-06-12 21:26:36.28274
23	2	3	f	2025-06-13 01:21:25.324022	2025-06-12 22:24:49.261412
22	1	3	f	2025-06-13 00:29:43.324921	2025-06-12 22:24:49.990854
24	3	3	t	2025-06-13 01:24:51.517524	\N
\.


--
-- TOC entry 3403 (class 0 OID 23747)
-- Dependencies: 212
-- Data for Name: tables; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tables (id, qr_code, is_occupied, assigned_server_id) FROM stdin;
4	4	f	4
5	5	f	3
6	6	f	4
2	2	f	4
1	1	f	3
3	3	t	3
\.


--
-- TOC entry 3401 (class 0 OID 23736)
-- Dependencies: 210
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, role) FROM stdin;
1	Admin	admin@example.com	admin123	admin
2	Chef	chef@example.com	chef123	kitchen
3	Server1	server1@example.com	server1	server
4	Server2	server2@example.com	server2	server
\.


--
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 219
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_id_seq', 50, true);


--
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 213
-- Name: menu_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.menu_items_id_seq', 29, true);


--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 217
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_id_seq', 30, true);


--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 215
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 17, true);


--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 221
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_id_seq', 17, true);


--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 227
-- Name: recipes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recipes_id_seq', 77, true);


--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 223
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 225
-- Name: table_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.table_sessions_id_seq', 24, true);


--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 211
-- Name: tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tables_id_seq', 6, true);


--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 209
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 3242 (class 2606 OID 23810)
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- TOC entry 3236 (class 2606 OID 23771)
-- Name: menu_items menu_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.menu_items
    ADD CONSTRAINT menu_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3240 (class 2606 OID 23793)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3238 (class 2606 OID 23779)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3244 (class 2606 OID 23819)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 23964)
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- TOC entry 3246 (class 2606 OID 23834)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 23844)
-- Name: table_sessions table_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3232 (class 2606 OID 23755)
-- Name: tables tables_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_pkey PRIMARY KEY (id);


--
-- TOC entry 3234 (class 2606 OID 23757)
-- Name: tables tables_qr_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_qr_code_key UNIQUE (qr_code);


--
-- TOC entry 3228 (class 2606 OID 23745)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3230 (class 2606 OID 23743)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3255 (class 2606 OID 23799)
-- Name: order_items order_items_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id);


--
-- TOC entry 3254 (class 2606 OID 23794)
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- TOC entry 3253 (class 2606 OID 23855)
-- Name: orders orders_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.table_sessions(id);


--
-- TOC entry 3252 (class 2606 OID 23780)
-- Name: orders orders_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id);


--
-- TOC entry 3256 (class 2606 OID 23820)
-- Name: payments payments_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- TOC entry 3260 (class 2606 OID 23970)
-- Name: recipes recipes_inventory_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES public.inventory(id) ON DELETE CASCADE;


--
-- TOC entry 3259 (class 2606 OID 23965)
-- Name: recipes recipes_menu_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_menu_item_id_fkey FOREIGN KEY (menu_item_id) REFERENCES public.menu_items(id) ON DELETE CASCADE;


--
-- TOC entry 3257 (class 2606 OID 23845)
-- Name: table_sessions table_sessions_table_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_table_id_fkey FOREIGN KEY (table_id) REFERENCES public.tables(id);


--
-- TOC entry 3258 (class 2606 OID 23850)
-- Name: table_sessions table_sessions_waiter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.table_sessions
    ADD CONSTRAINT table_sessions_waiter_id_fkey FOREIGN KEY (waiter_id) REFERENCES public.users(id);


--
-- TOC entry 3251 (class 2606 OID 23758)
-- Name: tables tables_assigned_server_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tables
    ADD CONSTRAINT tables_assigned_server_id_fkey FOREIGN KEY (assigned_server_id) REFERENCES public.users(id);


-- Completed on 2025-06-13 15:42:56

--
-- PostgreSQL database dump complete
--

