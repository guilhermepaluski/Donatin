# build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY . .
RUN dotnet restore Donatin.sln

# publica o projeto da API
RUN dotnet publish Donatin.Api/Donatin.Api.csproj -c Release -o /app/publish

# runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

# roda com o usuário sem privilégios que já vem na imagem do .NET (não como root)
USER $APP_UID

ENTRYPOINT ["dotnet", "Donatin.Api.dll"]