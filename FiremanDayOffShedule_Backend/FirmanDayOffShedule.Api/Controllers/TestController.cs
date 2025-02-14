using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private static List<TestData> testDataList = new List<TestData>
    {
        new TestData { Id = 1, Name = "Alice", Age = 30 },
        new TestData { Id = 2, Name = "Bob", Age = 25 },
        new TestData { Id = 3, Name = "Charlie", Age = 35 }
    };

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(testDataList);
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var item = testDataList.FirstOrDefault(t => t.Id == id);
        if (item == null)
        {
            return NotFound(new { Message = "Item not found" });
        }
        return Ok(item);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateItem(int id, [FromBody] TestData updatedItem)
    {
        var item = testDataList.FirstOrDefault(t => t.Id == id);
        if (item == null)
        {
            return NotFound(new { Message = "Item not found" });
        }

        item.Name = updatedItem.Name;
        item.Age = updatedItem.Age;

        return Ok(item);
    }


    [HttpPost("update")]
    public IActionResult UpdateItem([FromBody] TestData updatedItem)
    {
        var item = testDataList.FirstOrDefault(t => t.Id == updatedItem.Id);
        if (item == null)
        {
            return NotFound(new { Message = "Item not found" });
        }

        item.Name = updatedItem.Name;
        item.Age = updatedItem.Age;

        return Ok(new { Message = "Item updated successfully", UpdatedItem = item });
    }
}

public class TestData
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Age { get; set; }
}
