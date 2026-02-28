namespace api.Dtos.User
{
    public class TripPlanItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Latitude { get; set; } = string.Empty;
        public string Longitude { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }
}
