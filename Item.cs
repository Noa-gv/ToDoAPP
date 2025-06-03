using System;
using System.Collections.Generic;

namespace TodoApi
{
    public partial class Item
    {
        public int idItems  { get; set; }

        public string? nameItem { get; set; }

        public bool? IsComplete { get; set; }
    }
}


