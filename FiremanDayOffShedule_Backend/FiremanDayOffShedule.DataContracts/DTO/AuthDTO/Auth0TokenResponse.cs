﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace FiremanDayOffShedule.DataContracts.DTO.AuthDTO
{
    public class Auth0TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }

    }
}
