using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Donatin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarRetiradaNaDoacao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DonationMethod",
                table: "Donations",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "Entrega");

            migrationBuilder.AddColumn<string>(
                name: "DonorCep",
                table: "Donations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DonorComplement",
                table: "Donations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DonorNeighborhood",
                table: "Donations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DonorNumber",
                table: "Donations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DonorStreet",
                table: "Donations",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DonationMethod",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorCep",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorComplement",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorNeighborhood",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorNumber",
                table: "Donations");

            migrationBuilder.DropColumn(
                name: "DonorStreet",
                table: "Donations");
        }
    }
}
