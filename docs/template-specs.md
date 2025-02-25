# Photobooth Template Specifications

## Dimensions
- Template Width: 250px
- Template Height: ~800px (adjusts based on content)
- Photo Aspect Ratio: 4:3

## Photo Slots
- Each photo slot maintains a 4:3 aspect ratio
- Margin between photos: 12px (mb-3 in Tailwind)

## Template Design Guidelines
1. Create your template images at 250px width
2. Save templates in PNG format with transparency where needed
3. Place template files in `src/assets/templates/`
4. Template images should be designed to work with the photo layout:
   - Photos are stacked vertically
   - Each photo takes up the full width (250px)
   - Photos maintain 4:3 aspect ratio

## Implementation Notes
- Templates are applied as background images
- Photos are positioned on top of the template
- The template background should complement the photos without overwhelming them
- Consider leaving clear spaces for photo placement

## File Naming Convention
- Use descriptive, lowercase names
- Separate words with hyphens
- Example: `vintage-frame.png`, `polaroid-style.png`