import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1580192312721 implements MigrationInterface {
  name = "initial1580192312721";

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "addresses" ("id" SERIAL NOT NULL, "street_address" character varying NOT NULL, "delivery_instructions" character varying, "lat_lng" character varying NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_745d8f43d3af10ab8247465e450" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "mobile_number" character varying, "password" character varying, "sign_in_method" character varying NOT NULL, "fcm_token" character varying, "created_at" bigint NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "order_item_options" ("id" SERIAL NOT NULL, "choice_id" integer NOT NULL, "choice_name" character varying NOT NULL, "option_id" integer NOT NULL, "option_name" character varying NOT NULL, "option_price" real NOT NULL, "order_item_id" integer NOT NULL, CONSTRAINT "PK_8279922d5b99fccbeb617096227" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "product_name" character varying NOT NULL, "product_base_price" real NOT NULL, "total_price" real NOT NULL, "quantity" integer NOT NULL, "order_id" character varying NOT NULL, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" character varying NOT NULL, "additional_comments" character varying, "total_price" real NOT NULL, "date_placed" bigint NOT NULL, "status" character varying NOT NULL, "payment_method" character varying NOT NULL, "payment_status" character varying NOT NULL, "user_id" integer, "user_address_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "order_id" character varying NOT NULL, "initialized_by" integer NOT NULL, "method" character varying NOT NULL, "status" character varying NOT NULL, "amount" real NOT NULL, "transaction_ref" character varying NOT NULL, "date_created" integer NOT NULL, "payment_result" character varying, "payment_ref" character varying, "payer_ref" character varying, "date_updated" integer, "raw_result" text, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "product_choice_options" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying, "price" real NOT NULL, "choice_id" integer NOT NULL, CONSTRAINT "PK_d08f7a3851999a9affba6055039" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "product_choices" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "position" integer NOT NULL, "quantity_min" integer NOT NULL, "quantity_max" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_23e6929d5f4325ba25001dec7e0" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "price" real NOT NULL, "image" character varying NOT NULL, "product_type" character varying NOT NULL, "product_status" character varying NOT NULL, "created_at" bigint NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_464f927ae360106b783ed0b410" ON "products" ("slug") `,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" ADD CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_options" ADD CONSTRAINT "FK_977c146e75da0ec110daed37f81" FOREIGN KEY ("order_item_id") REFERENCES "order_items"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_645fc4a8c6f039b1ee2985efd3e" FOREIGN KEY ("user_address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_choice_options" ADD CONSTRAINT "FK_f7043b9fb3f945ccfafbda2cfd8" FOREIGN KEY ("choice_id") REFERENCES "product_choices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_choices" ADD CONSTRAINT "FK_151487f7a607201198c0614e21a" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );

    await this.seedData(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "product_choices" DROP CONSTRAINT "FK_151487f7a607201198c0614e21a"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "product_choice_options" DROP CONSTRAINT "FK_f7043b9fb3f945ccfafbda2cfd8"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_645fc4a8c6f039b1ee2985efd3e"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item_options" DROP CONSTRAINT "FK_977c146e75da0ec110daed37f81"`,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "addresses" DROP CONSTRAINT "FK_16aac8a9f6f9c1dd6bcb75ec023"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_464f927ae360106b783ed0b410"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "products"`, undefined);
    await queryRunner.query(`DROP TABLE "product_choices"`, undefined);
    await queryRunner.query(`DROP TABLE "product_choice_options"`, undefined);
    await queryRunner.query(`DROP TABLE "payments"`, undefined);
    await queryRunner.query(`DROP TABLE "orders"`, undefined);
    await queryRunner.query(`DROP TABLE "order_items"`, undefined);
    await queryRunner.query(`DROP TABLE "order_item_options"`, undefined);
    await queryRunner.query(`DROP TABLE "users"`, undefined);
    await queryRunner.query(`DROP TABLE "addresses"`, undefined);
  }

  private async seedData(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
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
    `);

    await queryRunner.query(`
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
    `);

    await queryRunner.query(`
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
    `);
  }
}
