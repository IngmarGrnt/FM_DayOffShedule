﻿using System.Security.Cryptography;
using System.Text;

namespace FiremanDayOffShedule.DataContracts.DTO.LoginDTO
{

        public static class PasswordHelper
        {
            public static string GenerateSalt()
            {
                byte[] saltBytes = new byte[16];
                using (var rng = RandomNumberGenerator.Create())
                {
                    rng.GetBytes(saltBytes);
                }
                return Convert.ToBase64String(saltBytes);
            }

            public static string HashPassword(string password, string salt)
            {
                using (var sha256 = SHA256.Create())
                {
                    var combined = salt + password;
                    var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(combined));
                    return Convert.ToBase64String(hashBytes);
                }
            }

            public static bool VerifyPassword(string currentPassword, string storedHash, string storedSalt)
            {
                var hash = HashPassword(currentPassword, storedSalt);
                return hash == storedHash;
            }

    }
}


