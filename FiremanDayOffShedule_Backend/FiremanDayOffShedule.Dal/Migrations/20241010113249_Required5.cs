using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FiremanDayOffShedule.Dal.Migrations
{
    /// <inheritdoc />
    public partial class Required5 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persons_Specialities_SpecialityId",
                table: "Persons");

            migrationBuilder.AlterColumn<int>(
                name: "SpecialityId",
                table: "Persons",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Persons_Specialities_SpecialityId",
                table: "Persons",
                column: "SpecialityId",
                principalTable: "Specialities",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persons_Specialities_SpecialityId",
                table: "Persons");

            migrationBuilder.AlterColumn<int>(
                name: "SpecialityId",
                table: "Persons",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Persons_Specialities_SpecialityId",
                table: "Persons",
                column: "SpecialityId",
                principalTable: "Specialities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
