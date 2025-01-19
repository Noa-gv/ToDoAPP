using TodoApi;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.OpenApi.Models;
using BCrypt.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// הזרקת DbContext
builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("ToDoDB"), ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("ToDoDB"))));


// הוספת Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();  // חובה עבור Minimal APIs
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "ToDo API",
        Description = "An ASP.NET Core Web API for managing ToDo items",
        TermsOfService = new Uri("https://example.com/terms"),
        Contact = new OpenApiContact
        {
            Name = "Example Contact",
            Url = new Uri("https://example.com/contact")
        },
        License = new OpenApiLicense
        {
            Name = "Example License",
            Url = new Uri("https://example.com/license")
        }
    });
});

// הגדרת CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin() // מאפשר כל מקור
              .AllowAnyMethod() // מאפשר כל שיטה (GET, POST וכו')
              .AllowAnyHeader(); // מאפשר כל כותרת
    });
});

var app = builder.Build();

// הוספת Swagger Middleware רק בסביבת פיתוח
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty; // Serve Swagger UI at root (http://localhost)
    });
}

// הפעלת CORS
app.UseCors("AllowAll");

// Route לשליפת כל הפריטים
app.MapGet("/items", async (ToDoDbContext dbContext) =>
{
    var items = await dbContext.Items.ToListAsync();
    return Results.Ok(items);
});

// Route להוספת פריט חדש
app.MapPost("/items", async (ToDoDbContext dbContext, Item newItem) =>
{
    dbContext.Items.Add(newItem);
    await dbContext.SaveChangesAsync();
    return Results.Created($"/items/{newItem.Id}", newItem);
});

// Route לעדכון פריט
app.MapPut("/items/{id}", async (ToDoDbContext dbContext, int id, Item updatedItem) =>
{
    var item = await dbContext.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    item.Name = updatedItem.Name;
    item.IsComplete = updatedItem.IsComplete;
    await dbContext.SaveChangesAsync();
    return Results.Ok(item);
});

// Route למחיקת פריט
app.MapDelete("/items/{id}", async (ToDoDbContext dbContext, int id) =>
{
    var item = await dbContext.Items.FindAsync(id);
    if (item is null) return Results.NotFound();

    dbContext.Items.Remove(item);
    await dbContext.SaveChangesAsync();
    return Results.NoContent();
});

// Route לשליפת כל המשתמשים
app.MapGet("/users", async (ToDoDbContext dbContext) =>
{
    var users = await dbContext.Users.ToListAsync();
    return Results.Ok(users);
});

// Route להוספת משתמש חדש
app.MapPost("/users", async (ToDoDbContext dbContext, User newUser) =>
{
    // השאת הסיסמה
    newUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newUser.PasswordHash);

    // הוספת המשתמש למסד הנתונים
    dbContext.Users.Add(newUser);

    // שמירת השינויים למסד נתונים
    await dbContext.SaveChangesAsync();

    // החזרת תשובה עם קישור למשתמש החדש
    return Results.Created($"/users/{newUser.Id}", newUser);  // יש להחליף ב-Id ולא ב-id
});

// Route לעדכון משתמש
app.MapPut("/users/{id}", async (ToDoDbContext dbContext, int id, User updatedUser) =>
{
    var user = await dbContext.Users.FindAsync(id);
    if (user == null) return Results.NotFound();

    user.Username = updatedUser.Username;
    if (!string.IsNullOrEmpty(updatedUser.PasswordHash))
    {
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUser.PasswordHash);
    }

    await dbContext.SaveChangesAsync();
    return Results.Ok(user);
});

// Route למחיקת משתמש
app.MapDelete("/users/{id}", async (ToDoDbContext dbContext, int id) =>
{
    var user = await dbContext.Users.FindAsync(id);
    if (user == null) return Results.NotFound();

    dbContext.Users.Remove(user);
    await dbContext.SaveChangesAsync();
    return Results.NoContent();
});


app.Run();
