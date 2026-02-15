using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class tour_master
{
    public int tour_id { get; set; }

    public int catmaster_id { get; set; }

    public int departure_date_id { get; set; }

    public string? description { get; set; }

    public virtual ICollection<booking_header> booking_header { get; set; } = new List<booking_header>();

    public virtual category_master catmaster { get; set; } = null!;

    public virtual departure_date_master departure_date { get; set; } = null!;

    public virtual ICollection<tour_addon_master> tour_addon_master { get; set; } = new List<tour_addon_master>();
}
