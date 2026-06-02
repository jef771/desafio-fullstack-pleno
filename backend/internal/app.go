package internal

type Secrets struct {
	JWTSecret   string
	Credentials Credentials
}

type Credentials struct {
	Username string
	Password string
}
