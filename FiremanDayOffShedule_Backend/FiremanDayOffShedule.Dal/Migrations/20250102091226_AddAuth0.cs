﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FiremanDayOffShedule.Dal.Migrations
{
    /// <inheritdoc />
    public partial class AddAuth0 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Auth0Id",
                table: "Persons",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Auth0Id",
                table: "Persons");
        }
    }
}
