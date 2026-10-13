using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Donatin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarDoacaoAnonima : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAnonymous",
                table: "Donations",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAnonymous",
                table: "Donations");
        }
    }
}
