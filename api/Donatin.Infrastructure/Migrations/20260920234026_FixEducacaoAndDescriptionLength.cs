using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Donatin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixEducacaoAndDescriptionLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // converte os dados antigos ANTES de qualquer outra mudança
            migrationBuilder.Sql("UPDATE \"Campaigns\" SET \"Category\" = 'Educacao' WHERE \"Category\" = 'Educação';");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Campaigns",
                type: "character varying(2000)",
                maxLength: 2000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(400)",
                oldMaxLength: 400);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE \"Campaigns\" SET \"Category\" = 'Educação' WHERE \"Category\" = 'Educacao';");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Campaigns",
                type: "character varying(400)",
                maxLength: 400,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(2000)",
                oldMaxLength: 2000);
        }
    }
}
