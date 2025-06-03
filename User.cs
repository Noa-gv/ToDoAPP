using System;
using System.Collections.Generic;

namespace TodoApi
{
    public class User
    {
        public int idusers { get; set; }
        public string? nameUser { get; set; }
        public string? passwordHash { get; set; }
    }
}
