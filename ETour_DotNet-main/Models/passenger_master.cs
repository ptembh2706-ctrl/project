using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class passenger_master
{
    public int passenger_id { get; set; }

    public int booking_id { get; set; }

    public string passenger_name { get; set; } = null!;

    public DateOnly? date_of_birth { get; set; }

    public string passenger_type { get; set; } = null!;

    public decimal passenger_amount { get; set; }

    public virtual booking_header booking { get; set; } = null!;
}
