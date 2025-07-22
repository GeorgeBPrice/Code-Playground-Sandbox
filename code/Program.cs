using System;
using System.Collections.Generic;
using System.Linq;

class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello from C#!");
        
        // Sample LINQ operations
        var numbers = new List<int> { 1, 2, 3, 4, 5 };
        Console.WriteLine($"Original list: [{string.Join(", ", numbers)}]");
        
        var doubled = numbers.Select(x => x * 2).ToList();
        Console.WriteLine($"Doubled list: [{string.Join(", ", doubled)}]");
        
        var sum = numbers.Sum();
        Console.WriteLine($"Sum of list: {sum}");
        
        // Sample object
        var person = new { Name = "John", Age = 30, City = "New York" };
        Console.WriteLine($"Person: {person.Name}, Age: {person.Age}, City: {person.City}");
        
        Console.WriteLine("Hello, World!");
    }
} 