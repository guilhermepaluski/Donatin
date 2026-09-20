using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Donatin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueCpfCnpj : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "CpfCnpj",
                table: "Users",
                type: "character varying(14)",
                maxLength: 14,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.CreateIndex(
                name: "IX_Users_CpfCnpj",
                table: "Users",
                column: "CpfCnpj",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_CpfCnpj",
                table: "Users");

            migrationBuilder.AlterColumn<string>(
                name: "CpfCnpj",
                table: "Users",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(14)",
                oldMaxLength: 14);
        }
    }
}
