using Microsoft.AspNetCore.Mvc.Filters;
using Serilog;

namespace Etour_Backend_dotnet.Filters;

public class LogActionFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        Log.Information("Entering Controller: {Controller}, Action: {Action}",
            context.RouteData.Values["controller"],
            context.RouteData.Values["action"]);
    }

    public void OnActionExecuted(ActionExecutedContext context)
    {
        // Check if there was an exception handled by ExceptionMiddleware
        if (context.Exception != null)
        {
            Log.Error(context.Exception, "Exception in Controller: {Controller}, Action: {Action}",
                context.RouteData.Values["controller"],
                context.RouteData.Values["action"]);
        }
        else
        {
            Log.Information("Exiting Controller: {Controller}, Action: {Action}",
                context.RouteData.Values["controller"],
                context.RouteData.Values["action"]);
        }
    }
}
