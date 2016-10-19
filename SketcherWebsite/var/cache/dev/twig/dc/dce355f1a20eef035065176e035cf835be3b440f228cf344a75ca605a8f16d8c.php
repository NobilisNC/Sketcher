<?php

/* base.html.twig */
class __TwigTemplate_2e9ad1b7648ad0a78f1b31b4a5ffb93cdae9187c7caeb971ce444416e2b19fd2 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
            'title' => array($this, 'block_title'),
            'stylesheets' => array($this, 'block_stylesheets'),
            'body' => array($this, 'block_body'),
            'javascripts' => array($this, 'block_javascripts'),
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_823ebbecca458eef0bef29d5c10842d9ae64b8ccb6f29dcec370fb894019be2b = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_823ebbecca458eef0bef29d5c10842d9ae64b8ccb6f29dcec370fb894019be2b->enter($__internal_823ebbecca458eef0bef29d5c10842d9ae64b8ccb6f29dcec370fb894019be2b_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "base.html.twig"));

        // line 1
        echo "<!DOCTYPE html>
<html>
    <head>
        <meta charset=\"UTF-8\" />
        <title>";
        // line 5
        $this->displayBlock('title', $context, $blocks);
        echo "</title>
        ";
        // line 6
        $this->displayBlock('stylesheets', $context, $blocks);
        // line 7
        echo "        <link rel=\"icon\" type=\"image/x-icon\" href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\AssetExtension')->getAssetUrl("favicon.ico"), "html", null, true);
        echo "\" />
    </head>
    <body>
        ";
        // line 10
        $this->displayBlock('body', $context, $blocks);
        // line 11
        echo "        ";
        $this->displayBlock('javascripts', $context, $blocks);
        // line 12
        echo "    </body>
</html>
";
        
        $__internal_823ebbecca458eef0bef29d5c10842d9ae64b8ccb6f29dcec370fb894019be2b->leave($__internal_823ebbecca458eef0bef29d5c10842d9ae64b8ccb6f29dcec370fb894019be2b_prof);

    }

    // line 5
    public function block_title($context, array $blocks = array())
    {
        $__internal_9864a663d99cfb31631b0066288b3301867d96630928bd585ca96c41faf46838 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_9864a663d99cfb31631b0066288b3301867d96630928bd585ca96c41faf46838->enter($__internal_9864a663d99cfb31631b0066288b3301867d96630928bd585ca96c41faf46838_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        echo "Welcome!";
        
        $__internal_9864a663d99cfb31631b0066288b3301867d96630928bd585ca96c41faf46838->leave($__internal_9864a663d99cfb31631b0066288b3301867d96630928bd585ca96c41faf46838_prof);

    }

    // line 6
    public function block_stylesheets($context, array $blocks = array())
    {
        $__internal_b1f37aca8ec5e427d82bf53e69f548203ab35e4400d8d4aeb580844ac0009940 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_b1f37aca8ec5e427d82bf53e69f548203ab35e4400d8d4aeb580844ac0009940->enter($__internal_b1f37aca8ec5e427d82bf53e69f548203ab35e4400d8d4aeb580844ac0009940_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "stylesheets"));

        
        $__internal_b1f37aca8ec5e427d82bf53e69f548203ab35e4400d8d4aeb580844ac0009940->leave($__internal_b1f37aca8ec5e427d82bf53e69f548203ab35e4400d8d4aeb580844ac0009940_prof);

    }

    // line 10
    public function block_body($context, array $blocks = array())
    {
        $__internal_88f37b348db8937c5f29d04a445414fb9e1f73e1b047fa00073d63a8f5c46c42 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_88f37b348db8937c5f29d04a445414fb9e1f73e1b047fa00073d63a8f5c46c42->enter($__internal_88f37b348db8937c5f29d04a445414fb9e1f73e1b047fa00073d63a8f5c46c42_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        
        $__internal_88f37b348db8937c5f29d04a445414fb9e1f73e1b047fa00073d63a8f5c46c42->leave($__internal_88f37b348db8937c5f29d04a445414fb9e1f73e1b047fa00073d63a8f5c46c42_prof);

    }

    // line 11
    public function block_javascripts($context, array $blocks = array())
    {
        $__internal_9e42784d8d174f8bda6a7d0d190ef9b6f88060bc04bb37334bc4a0d7ac2709a5 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_9e42784d8d174f8bda6a7d0d190ef9b6f88060bc04bb37334bc4a0d7ac2709a5->enter($__internal_9e42784d8d174f8bda6a7d0d190ef9b6f88060bc04bb37334bc4a0d7ac2709a5_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "javascripts"));

        
        $__internal_9e42784d8d174f8bda6a7d0d190ef9b6f88060bc04bb37334bc4a0d7ac2709a5->leave($__internal_9e42784d8d174f8bda6a7d0d190ef9b6f88060bc04bb37334bc4a0d7ac2709a5_prof);

    }

    public function getTemplateName()
    {
        return "base.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  93 => 11,  82 => 10,  71 => 6,  59 => 5,  50 => 12,  47 => 11,  45 => 10,  38 => 7,  36 => 6,  32 => 5,  26 => 1,);
    }

    public function getSource()
    {
        return "<!DOCTYPE html>
<html>
    <head>
        <meta charset=\"UTF-8\" />
        <title>{% block title %}Welcome!{% endblock %}</title>
        {% block stylesheets %}{% endblock %}
        <link rel=\"icon\" type=\"image/x-icon\" href=\"{{ asset('favicon.ico') }}\" />
    </head>
    <body>
        {% block body %}{% endblock %}
        {% block javascripts %}{% endblock %}
    </body>
</html>
";
    }
}
