using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Donatin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAboutMeAndProfilePhotoToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AboutMe",
                table: "Users",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProfilePhotoUrl",
                table: "Users",
                type: "character varying(500)",
                maxLength: 500,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AboutMe",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ProfilePhotoUrl",
                table: "Users");
        }
    }
}
