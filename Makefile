init-env:
	@echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/database_name?schema=public\"\n" >> .env; \
	echo "PORT=3333\n" >> .env;
	@make generate-keys

generate-keys: generate-private-key generate-public-key
	@echo "Chaves geradas com sucesso e salvas no arquivo .env."

generate-private-key:
	@openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
	@echo "Chave privada gerada."

generate-public-key: generate-private-key
	@openssl rsa -pubout -in private.key -out public.key -outform PEM
	@echo "Chave pública gerada."
	@JWT_PRIVATE_KEY=$$(openssl base64 -in private.key -A); \
	JWT_PUBLIC_KEY=$$(openssl base64 -in public.key -A); \
	echo "JWT_PRIVATE_KEY=\"$$JWT_PRIVATE_KEY\"" >> .env; \
	echo "JWT_PUBLIC_KEY=\"$$JWT_PUBLIC_KEY\"" >> .env; \
	rm private.key public.key
