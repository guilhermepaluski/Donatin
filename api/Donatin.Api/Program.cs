using System.Text;
using System.Text.Json.Serialization;
using Donatin.Domain.Interfaces;
using Donatin.Domain.Interfaces.Repositories;
using Donatin.Domain.Interfaces.Services;
using Donatin.Infrastructure.Data;
using Donatin.Infrastructure.Repositories;
using Donatin.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

DotNetEnv.Env.TraversePath().Load();

var builder = WebApplication.CreateBuilder(args);

// injetando as dependencias (do Services e do Repositories)
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ICampaignRepository, CampaignRepository>();

                       // configurando a conexão com o PostgreSQL com a ConnectionString do .env
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DonatinDb")
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));

// middlewares (configurando a conexão com o PostgreSQL com a JwtSecret vindo do .env também)
var jwtSecret = Environment.GetEnvironmentVariable("Jwt__Secret")
    ?? builder.Configuration["Jwt:Secret"] ?? "ChaveSecretaSuperSeguraParaDesenvolvimentoLocalComPeloMenos32Caracteres";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  options.RequireHttpsMetadata = false;
  options.SaveToken = true;
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuerSigningKey = true,
    IssuerSigningKey = new SymmetricSecurityKey(key),
    ValidateIssuer = false,
    ValidateAudience = false
  };
});

// configuração do CORS
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAll", policy =>
  {
    policy.AllowAnyOrigin()
          .AllowAnyHeader()
          .AllowAnyMethod();
  });
});

// config para mapear os Enums como texto bruto no banco (ao invés de id's - 0, 1, 2 etc.)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
      options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors("AllowAll");

app.UseAuthentication(); // aplica a verificação de quem é o usuário (JWT)
app.UseAuthorization(); // aplica as permissões de acesso

app.MapControllers();

app.Run();