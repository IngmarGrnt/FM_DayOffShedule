using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FiremanDayOffShedule.Dal.Migrations
{
    /// <inheritdoc />
    public partial class Password : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Persons",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Salt",
                table: "Persons",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Persons");

            migrationBuilder.DropColumn(
                name: "Salt",
                table: "Persons");
        }
    }
}
