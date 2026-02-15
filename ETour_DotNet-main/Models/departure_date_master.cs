using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class departure_date_master
{
    public int departure_date_id { get; set; }

    public int catmaster_id { get; set; }

    public DateOnly departure_date { get; set; }

    public DateOnly end_date { get; set; }

    public int number_of_days { get; set; }

    public virtual ICollection<booking_header> booking_header { get; set; } = new List<booking_header>();

    public virtual category_master catmaster { get; set; } = null!;

    public virtual ICollection<tour_master> tour_master { get; set; } = new List<tour_master>();
}
