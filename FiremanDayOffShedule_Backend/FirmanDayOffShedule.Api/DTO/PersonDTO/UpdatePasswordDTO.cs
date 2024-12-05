namespace FirmanDayOffShedule.Api.DTO.PersonDTO
{
    public class UpdatePasswordDTO
    {
        public int Id { get; set; } // ID van de persoon
        public string CurrentPassword { get; set; } // Huidig wachtwoord
        public string NewPassword { get; set; } // Nieuw wachtwoord
    }
}
