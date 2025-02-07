API Endpoints : 

    Authentication
        POST /auth/login - Login
        POST /auth/register - Register
        GET /auth/protected - test du guard


    Movies
        GET /find/:name - Recuperer une liste de films par un mot cle
        GET /findBy/:id - Recuperer les details d'un film par son Id
        GET /now_playing - Recuperer les films du moment
        GET /genre/list - Recuperer la liste des genres de film

    Reservations
        POST /create - Create reservation, on verifie la disponibilite d'un film et si l'utilisateur est present dans la DB, on ne peut pas reserver des films si les creneaux ne sont pas separe de 2 heures (exemple reservation a 14h, la prochaine reservation possible par cet utilisateur dans le meme jour sera a partir de 16h01)
        GET /reservations - List reservations par l'utilisateur
        DELETE /reservations/:id - Delete une reservation par son Id
        PATCH /update/:id - mise a jour d'une reservation, actuellement incomplet, il ne prend pas bien en compte les conflits sur les seances encore


📚 Key Dependencies
NestJS - Backend framework
Prisma - ORM
Jest - Testing
PostgreSQL - Database
JWT - Authentication
TMDB API - Movie data
