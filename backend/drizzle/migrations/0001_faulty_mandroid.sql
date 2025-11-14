ALTER TABLE "Editora" RENAME TO "editora";--> statement-breakpoint
ALTER TABLE "livros" DROP CONSTRAINT "livros_editora_id_Editora_id_fk";
--> statement-breakpoint
ALTER TABLE "livros" ADD CONSTRAINT "livros_editora_id_editora_id_fk" FOREIGN KEY ("editora_id") REFERENCES "public"."editora"("id") ON DELETE restrict ON UPDATE cascade;