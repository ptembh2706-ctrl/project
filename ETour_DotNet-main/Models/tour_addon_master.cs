using System;
using System.Collections.Generic;

namespace Etour_Backend_dotnet.Models;

public partial class tour_addon_master
{
    public int tour_addon_id { get; set; }

    public int tour_id { get; set; }

    public int addon_id { get; set; }

    public bool is_available { get; set; }

    public virtual addon_on_master addon { get; set; } = null!;

    public virtual tour_master tour { get; set; } = null!;
}
