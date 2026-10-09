using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Donatin.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AdicionarEnderecoNaCampanhaEExibirEnderecoNoPerfil : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowAddressPublicly",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryCep",
                table: "Campaigns",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryComplement",
                table: "Campaigns",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryNeighborhood",
                table: "Campaigns",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryNumber",
                table: "Campaigns",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeliveryStreet",
                table: "Campaigns",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowAddressPublicly",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "DeliveryCep",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "DeliveryComplement",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "DeliveryNeighborhood",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "DeliveryNumber",
                table: "Campaigns");

            migrationBuilder.DropColumn(
                name: "DeliveryStreet",
                table: "Campaigns");
        }
    }
}
