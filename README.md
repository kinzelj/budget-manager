Web application that simulates inventory management of Zoo database items.

To deploy development environment:

In command terminal:
1. `git clone https://github.com/kinzelj/budget-manager.git`
2. `cd budget-manager/`
3. `npm install`
4. `cd client/`
5. `npm install`
6. `cd ..`
8. Create .env file as instructed below.
7. `npm run dev`

In project directory create .env file with the following environment variable updated with users mongoDB URI:
- `MONGO_URI="user mongoDB URI"`
                                                      