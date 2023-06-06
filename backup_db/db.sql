-- public."Category" definition

-- Drop table

-- DROP TABLE public."Category";

CREATE TABLE public."Category" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "Category_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


-- public."Size" definition

-- Drop table

-- DROP TABLE public."Size";

CREATE TABLE public."Size" (
	id serial4 NOT NULL,
	size_value float8 NOT NULL,
	CONSTRAINT "Size_pkey" PRIMARY KEY (id)
);


-- public."User" definition

-- Drop table

-- DROP TABLE public."User";

CREATE TABLE public."User" (
	id serial4 NOT NULL,
	email text NOT NULL,
	"name" text NULL,
	"password" text NULL,
	"role" public."Role" NOT NULL DEFAULT 'USER_ROLE'::"Role",
	CONSTRAINT "User_pkey" PRIMARY KEY (id)
);
CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


-- public."Bill" definition

-- Drop table

-- DROP TABLE public."Bill";

CREATE TABLE public."Bill" (
	id serial4 NOT NULL,
	total int4 NOT NULL DEFAULT 0,
	"isPaid" bool NOT NULL DEFAULT false,
	status public."BillStatus" NOT NULL DEFAULT 'PENDING'::"BillStatus",
	"userId" int4 NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Bill_pkey" PRIMARY KEY (id),
	CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- public."Shoe" definition

-- Drop table

-- DROP TABLE public."Shoe";

CREATE TABLE public."Shoe" (
	id serial4 NOT NULL,
	"name" text NOT NULL,
	description varchar(500) NULL,
	price float8 NOT NULL,
	sale float8 NOT NULL DEFAULT 0,
	"categoryId" int4 NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Shoe_pkey" PRIMARY KEY (id),
	CONSTRAINT "Shoe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- public."Warehouse" definition

-- Drop table

-- DROP TABLE public."Warehouse";

CREATE TABLE public."Warehouse" (
	id serial4 NOT NULL,
	"sizeId" int4 NOT NULL,
	"shoeId" int4 NOT NULL,
	qty int4 NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Warehouse_pkey" PRIMARY KEY (id),
	CONSTRAINT "Warehouse_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES public."Shoe"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "Warehouse_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES public."Size"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "Warehouse_sizeId_shoeId_idx" ON public."Warehouse" USING btree ("sizeId", "shoeId");


-- public."BillDetails" definition

-- Drop table

-- DROP TABLE public."BillDetails";

CREATE TABLE public."BillDetails" (
	"billId" int4 NOT NULL,
	"warehouseId" int4 NOT NULL,
	qty int4 NOT NULL,
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "BillDetails_pkey" PRIMARY KEY ("billId", "warehouseId"),
	CONSTRAINT "BillDetails_billId_fkey" FOREIGN KEY ("billId") REFERENCES public."Bill"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "BillDetails_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES public."Warehouse"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- public."Images" definition

-- Drop table

-- DROP TABLE public."Images";

CREATE TABLE public."Images" (
	id serial4 NOT NULL,
	url text NOT NULL,
	"shoeId" int4 NOT NULL,
	CONSTRAINT "Images_pkey" PRIMARY KEY (id),
	CONSTRAINT "Images_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES public."Shoe"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);


-- public."Rating" definition

-- Drop table

-- DROP TABLE public."Rating";

CREATE TABLE public."Rating" (
	"userId" int4 NOT NULL,
	"shoeId" int4 NOT NULL,
	rate_value int4 NOT NULL,
	message _text NULL DEFAULT ARRAY[]::text[],
	"createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"updatedAt" timestamp(3) NOT NULL,
	CONSTRAINT "Rating_pkey" PRIMARY KEY ("userId", "shoeId"),
	CONSTRAINT "Rating_shoeId_fkey" FOREIGN KEY ("shoeId") REFERENCES public."Shoe"(id) ON DELETE RESTRICT ON UPDATE CASCADE,
	CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE RESTRICT ON UPDATE CASCADE
);