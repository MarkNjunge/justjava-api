-- ======================================
-- PRODUCTS
-- ======================================

INSERT INTO public.products ("name",slug,description,price,image,product_type,product_status,created_at) VALUES 
('Americano','americano','Italian espresso gets the American treatment; hot water fills the cup for a rich alternative to drip coffee.
Made from water and espresso.',120,'https://res.cloudinary.com/marknjunge/image/upload/v1572600845/justjava/products/americano.jpg','coffee','enabled',1574605132)
,('Cappuccino','cappuccino','A single, perfectly extracted shot of espresso is marbled with freshly steamed milk to create this coffeehouse staple.
Made from foam, milk and espresso.',150,'https://res.cloudinary.com/marknjunge/image/upload/v1572600845/justjava/products/cappuccino.jpg','coffee','enabled',1574605138)
,('Espresso','espresso','Our beans are deep roasted, our shots hand-pulled. Taste the finest, freshly ground espresso shot in town.
Just a shot of espresso.',100,'https://res.cloudinary.com/marknjunge/image/upload/v1572600845/justjava/products/espresso.jpg','coffee','enabled',1574605142)
,('Mocha','mocha','A marriage made in heaven. Espresso, steamed milk and our finest Dutch Cocoa. Whipped cream officiates.
Made from milk, chocolate syrup and espresso',150,'https://res.cloudinary.com/marknjunge/image/upload/v1572600845/justjava/products/mocha.jpg','coffee','enabled',1574605151)
,('Latte','latte','This coffee house favorite adds silky steamed milk to shots of rich espresso, finished with a layer of foam.
Made from milk and espresso.',150,'https://res.cloudinary.com/marknjunge/image/upload/v1572600845/justjava/products/latte.jpg','coffee','enabled',1574605155)
,('Iced Coffee','iced-coffee','Rich espresso, sweetened condensed milk, and cold milk poured over ice.
Made from milk, espresso and ice.',170,'https://res.cloudinary.com/marknjunge/image/upload/v1572600853/justjava/products/iced-coffee.jpg','coffee','enabled',1574605160)
,('Cafe frappe','cafe-frappe','Rich espresso is pulled then poured over ice cream for true refreshment. Topped with whipped cream.
Made from ice cream, espresso and whipped cream.',180,'https://res.cloudinary.com/marknjunge/image/upload/v1572600853/justjava/products/cafe-frappe.jpg','coffee','enabled',1574605164)
,('Macchiato','macchiato','What could top a hand-pulled shot of our richest, freshest espresso? A dollop of perfectly steamed foam. Made from foam and espresso.',150,'https://res.cloudinary.com/marknjunge/image/upload/v1572600845/justjava/products/macchiato.jpg','coffee','enabled',1574605147)
;

-- ======================================
-- PRODUCT CHOICES
-- ======================================

INSERT INTO public.product_choices ("name","position",quantity_min,quantity_max,product_id) VALUES 
('Single, double or triple',0,1,1,1)
,('Toppings',0,0,-1,1)
,('Single, double or triple',0,1,1,2)
,('Type of milk',0,0,1,2)
,('Toppings',0,0,-1,2)
,('Single, double or triple',0,1,1,3)
,('Toppings',0,0,-1,3)
,('Single, double or triple',0,1,1,4)
,('Toppings',0,0,-1,4)
,('Single, double or triple',0,1,1,5)
;
INSERT INTO public.product_choices ("name","position",quantity_min,quantity_max,product_id) VALUES 
('Type of milk',0,0,1,5)
,('Toppings',0,0,-1,5)
,('Single, double or triple',0,1,1,6)
,('Type of milk',0,0,1,6)
,('Toppings',0,0,-1,6)
,('Single, double or triple',0,1,1,7)
,('Type of milk',0,0,1,7)
,('Toppings',0,0,-1,7)
,('Single, double or triple',0,1,1,8)
,('Type of milk',0,0,1,8)
;
INSERT INTO public.product_choices ("name","position",quantity_min,quantity_max,product_id) VALUES 
('Toppings',0,0,-1,8)
;

-- ======================================
-- PRODUCT CHOICES OPTIONS
-- ======================================

INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Triple','Three shots of coffee',80,1)
,('Double','Two shots of coffee',40,1)
,('Single','A single shot of coffee',0,1)
,('Mini marshmallows',NULL,60,2)
,('Mint',NULL,30,2)
,('Nutmeg (powdered)',NULL,30,2)
,('Chocolate (curls)',NULL,30,2)
,('Cinnamon (sprinkles)',NULL,30,2)
,('Triple','Three shots of coffee',80,3)
,('Double','Two shots of coffee',40,3)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Single','A single shot of coffee',0,3)
,('Skim milk',NULL,20,4)
,('Soy milk',NULL,20,4)
,('Mini marshmallows',NULL,60,5)
,('Mint',NULL,30,5)
,('Nutmeg (powdered)',NULL,30,5)
,('Chocolate (curls)',NULL,30,5)
,('Cinnamon (sprinkles)',NULL,30,5)
,('Triple','Three shots of coffee',80,6)
,('Double','Two shots of coffee',40,6)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Single','A single shot of coffee',0,6)
,('Mini marshmallows',NULL,60,7)
,('Mint',NULL,30,7)
,('Nutmeg (powdered)',NULL,30,7)
,('Chocolate (curls)',NULL,30,7)
,('Cinnamon (sprinkles)',NULL,30,7)
,('Triple','Three shots of coffee',80,8)
,('Double','Two shots of coffee',40,8)
,('Single','A single shot of coffee',0,8)
,('Mini marshmallows',NULL,60,9)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Mint',NULL,30,9)
,('Nutmeg (powdered)',NULL,30,9)
,('Chocolate (curls)',NULL,30,9)
,('Cinnamon (sprinkles)',NULL,30,9)
,('Triple','Three shots of coffee',80,10)
,('Double','Two shots of coffee',40,10)
,('Single','A single shot of coffee',0,10)
,('Skim milk',NULL,20,11)
,('Soy milk',NULL,20,11)
,('Mini marshmallows',NULL,60,12)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Mint',NULL,30,12)
,('Nutmeg (powdered)',NULL,30,12)
,('Chocolate (curls)',NULL,30,12)
,('Cinnamon (sprinkles)',NULL,30,12)
,('Triple','Three shots of coffee',80,13)
,('Double','Two shots of coffee',40,13)
,('Single','A single shot of coffee',0,13)
,('Skim milk',NULL,20,14)
,('Soy milk',NULL,20,14)
,('Mini marshmallows',NULL,60,15)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Mint',NULL,30,15)
,('Nutmeg (powdered)',NULL,30,15)
,('Chocolate (curls)',NULL,30,15)
,('Cinnamon (sprinkles)',NULL,30,15)
,('Triple','Three shots of coffee',80,16)
,('Double','Two shots of coffee',40,16)
,('Single','A single shot of coffee',0,16)
,('Skim milk',NULL,20,17)
,('Soy milk',NULL,20,17)
,('Mini marshmallows',NULL,60,18)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Mint',NULL,30,18)
,('Nutmeg (powdered)',NULL,30,18)
,('Chocolate (curls)',NULL,30,18)
,('Cinnamon (sprinkles)',NULL,30,18)
,('Triple','Three shots of coffee',80,19)
,('Double','Two shots of coffee',40,19)
,('Single','A single shot of coffee',0,19)
,('Skim milk',NULL,20,20)
,('Soy milk',NULL,20,20)
,('Mini marshmallows',NULL,60,21)
;
INSERT INTO public.product_choice_options ("name",description,price,choice_id) VALUES 
('Mint',NULL,30,21)
,('Nutmeg (powdered)',NULL,30,21)
,('Chocolate (curls)',NULL,30,21)
,('Cinnamon (sprinkles)',NULL,30,21)
;