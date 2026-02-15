using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class customer_master
{
    public int customer_id { get; set; }

    public string? name { get; set; }

    public string? email { get; set; }

    public string? mobile_number { get; set; }

    public string? password { get; set; }

    public string? address { get; set; }

    public string? city { get; set; }

    public string? state { get; set; }

    public string? reset_password_token { get; set; }

    public DateTime? reset_password_token_expiry { get; set; }

    public string? role { get; set; }

    public virtual ICollection<booking_header> booking_header { get; set; } = new List<booking_header>();
}
