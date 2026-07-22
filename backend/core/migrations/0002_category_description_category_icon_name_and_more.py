from django.db import migrations, models


def populate_unique_registration_codes(apps, schema_editor):
    Project = apps.get_model('core', 'Project')
    track_counts = {'software': 0, 'graphic_design': 0, 'ai_prompting': 0}
    prefix_map = {'software': 'SOFT', 'graphic_design': 'GRAP', 'ai_prompting': 'AI'}

    for project in Project.objects.all():
        if not project.registration_code:
            track = getattr(project, 'track', 'software') or 'software'
            prefix = prefix_map.get(track, 'SOFT')
            track_counts[track] = track_counts.get(track, 0) + 1
            project.registration_code = f"{prefix}_{track_counts[track]:03d}"
            project.save(update_fields=['registration_code'])


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='category',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AddField(
            model_name='category',
            name='icon_name',
            field=models.CharField(blank=True, default='Grid', max_length=50),
        ),
        migrations.AddField(
            model_name='category',
            name='slug',
            field=models.SlugField(blank=True, default='', max_length=100),
        ),
        migrations.AddField(
            model_name='project',
            name='contact_email',
            field=models.EmailField(blank=True, default='', max_length=254),
        ),
        migrations.AddField(
            model_name='project',
            name='contact_name',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='project',
            name='contact_phone',
            field=models.CharField(blank=True, default='', max_length=50),
        ),
        migrations.AddField(
            model_name='project',
            name='featured',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='project',
            name='track',
            field=models.CharField(choices=[('software', 'Software Track'), ('graphic_design', 'Design Track'), ('ai_prompting', 'AI Prompting')], default='software', max_length=50),
        ),
        migrations.AddField(
            model_name='project',
            name='registration_code',
            field=models.CharField(blank=True, default=None, max_length=50, null=True),
        ),
        migrations.RunPython(
            populate_unique_registration_codes,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.AlterField(
            model_name='project',
            name='registration_code',
            field=models.CharField(blank=True, default=None, max_length=50, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='project',
            name='show_contact_publicly',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='project',
            name='tagline',
            field=models.CharField(blank=True, default='', max_length=255),
        ),
        migrations.AddField(
            model_name='project',
            name='tags',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(blank=True, default=''),
        ),
    ]
