using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddViewCountToAttractions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "IF COL_LENGTH('TouristAttractions','ViewCount') IS NULL " +
                "BEGIN ALTER TABLE [TouristAttractions] ADD [ViewCount] int NOT NULL DEFAULT 0; END");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "IF COL_LENGTH('TouristAttractions','ViewCount') IS NOT NULL " +
                "BEGIN ALTER TABLE [TouristAttractions] DROP COLUMN [ViewCount]; END");
        }
    }
}
