using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class booking_addon_master
{
    public int booking_addon_id { get; set; }

    public int booking_id { get; set; }

    public int addon_id { get; set; }

    public int quantity { get; set; }

    public decimal addon_amount { get; set; }

    public virtual addon_on_master addon { get; set; } = null!;

    public virtual booking_header booking { get; set; } = null!;
}
